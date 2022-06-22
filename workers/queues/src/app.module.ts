import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppService } from './app.service'
import { MailModule } from './mailer/mailer.module'

@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: 'mail-queue',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => ({
                redis: {
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: configService.get('REDIS_PORT') || 6379
                }
            })
        }),
        MailModule,
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
    ],
    providers: [AppService],
})
export class AppModule {}