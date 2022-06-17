import { RedisService } from "@liaoliaots/nestjs-redis";
import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor('mail-queue')
export class MailProcessor {
    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly mailerService: MailerService,
        private readonly redisService: RedisService
    ) {}

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`)
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any) {
        this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`)
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack)
    }

    @Process('confirm')
    async sendConfirmationToken(job: Job<{ user: any, token: string }>) {
        try {
            const { user, token } = job.data

            await this.redisService.getClient().set(`confirm-account:${token}`, user.id, 'EX', 1000 * 60 * 60 * 1) // 1 hour until expires

            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Confirm your email',
                template: 'confirm-email',
                context: {
                    token
                }
            })
        } catch (err) {
            
        }
    }

    @Process('reset')
    async sendResetToken(job: Job<{ user: any, token: string }>) {
        try {
            const { user, token } = job.data

            await this.redisService.getClient().set(`reset-password:${token}`, user.id, 'EX', 1000 * 60 * 60 * 1) // 1 hour until expires
    
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Reset your password',
                template: 'reset-password',
                context: {
                    token
                }
            })
        } catch (err) {
            
        }
    }
}