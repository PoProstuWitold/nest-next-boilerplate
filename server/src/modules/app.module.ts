import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'

import { V1Module } from './v1/v1.module'
import { MainController } from './app.controller'
import { WsEmitterClientOptions, WsEmitterModule } from './v1/chat/ws-emitter.module'
import { User } from '../common/entities'
import { Invitation, Room } from './v1/room/entities'
import { Message } from './v1/message/message.entity'

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
                    entities: [User, Room, Invitation, Message],
                    synchronize: true
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
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
                return {
                    config: {
                        host: configService.get('REDIS_HOST') || 'localhost',
                        port: configService.get('REDIS_PORT') || 6379,
                    }
                }
            }
        }),
        WsEmitterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<WsEmitterClientOptions> => {
                return {
                    config: {
                        host: configService.get('REDIS_HOST') || 'localhost',
                        port: configService.get('REDIS_PORT') || 6379,
                    }
                }
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
