import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { RedisModule } from '@liaoliaots/nestjs-redis'

import { V1Module } from './v1/v1.module'
import { MainController } from './app.controller'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [
                ConfigModule
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: configService.get('DB_TYPE'),
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + './../**/**.entity{.ts,.js}'],
                    synchronize: configService.get('DB_SYNC') === 'true'
                } as TypeOrmModuleAsyncOptions
            }
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        RedisModule.forRoot({
            config: {
                host: 'localhost',
                port: 6379,
            }
        }),
        V1Module
    ],
    controllers: [MainController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
          
    ]
})
export class AppModule {}
