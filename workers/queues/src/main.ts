import { config } from 'dotenv'
config()
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, Logger } from '@nestjs/common'

import { AppModule } from './app.module'
import { AppService } from './app.service'

export async function bootstrap(): Promise<INestApplicationContext> {
    const app = await NestFactory.createApplicationContext(AppModule)

    const logger = new Logger('WorkerMain')
    const appService = app.get(AppService)

    logger.log(appService.getMessage())

    return app
}

void bootstrap().catch(err => {
    console.error(err)
    process.exit(1)
})