import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookOauthStrategy, GoogleOauthStrategy, JwtAuthStrategy } from './strategies';

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                    secret: configService.get('JWT_ACCESS_SECRET_KEY'),
                    signOptions: {
                        expiresIn: configService.get('JWT_ACCESS_EXPIRATION_TIME')
                    }
            })
        }),
        BullModule.registerQueue({
            name: 'mail-queue',
            redis: {
                host: 'localhost',
                port: 6379
            }
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GoogleOauthStrategy,
        FacebookOauthStrategy,
        JwtAuthStrategy
    ]
})
export class AuthModule {}
