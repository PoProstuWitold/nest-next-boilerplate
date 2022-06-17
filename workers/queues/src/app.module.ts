import { RedisModule } from '@liaoliaots/nestjs-redis'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

import { AppService } from './app.service'
import { MailModule } from './mailer/mailer.module'

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail-queue',
            redis: {
                host: 'localhost',
                port: 6379
            }
        }),
        MailModule,
        RedisModule.forRoot({
            config: {
                host: 'localhost',
                port: 6379,
            }
        }),
    ],
    providers: [AppService],
})
export class AppModule {}