import { config } from 'dotenv'
config()
import { NestFactory } from '@nestjs/core'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from './modules/main/app.module'
import { setupSwagger } from './swagger'
import * as express from 'express'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    setupSwagger(app)

    app.enableCors({
        credentials: true,
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200
    })
    app.setGlobalPrefix('/api')
    app.useGlobalPipes(new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors: ValidationError[]) => {
            new BadRequestException(errors)
        }
    }))
    app.use(express.json())
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(Number(process.env.PORT))
}

void bootstrap()
