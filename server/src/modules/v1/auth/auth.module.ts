import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../common/entities/user.entity';
import { UserRepository } from '../../../common/repositories';
import * as passport from 'passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { FacebookOauthStrategy } from './strategies/facebook-oauth.strategy';
import { GoogleOauthStrategy } from './strategies/google-oauth.strategy';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, UserRepository
        ]),
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
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GoogleOauthStrategy,
        FacebookOauthStrategy,
        JwtAuthStrategy,
        LocalStrategy
    ]
})
export class AuthModule {}
