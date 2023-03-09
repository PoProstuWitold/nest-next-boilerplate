import { NestFactory, Reflector } from '@nestjs/core'
import { ClassSerializerInterceptor, HttpException, HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { useContainer, ValidationError } from 'class-validator'
import * as express from 'express'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as compression from 'compression'

import { AppModule } from './modules/app.module'
import { setupSwagger } from './common/swagger'
import { RedisIoAdapter } from './modules/v1/chat/chat.adapter'

export async function bootstrap(): Promise<NestExpressApplication> {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter()
    )

    const configService = app.get<ConfigService>(ConfigService)
    const reflector = app.get(Reflector)

    // GLOBAL MIDDLEWARES
    app.enableCors({
        credentials: true,
        origin: [
            configService.get('ORIGIN')
        ],
        optionsSuccessStatus: 200,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
    })
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1'
    })
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(helmet())
    app.use(compression())


    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

    const redisIoAdapter = new RedisIoAdapter(app)
    await redisIoAdapter.connectToRedis()

    app.useWebSocketAdapter(redisIoAdapter)
    
    if(configService.get('NODE_ENV') === 'development') {
        setupSwagger(app)
    }

    // app.enable('trust proxy') //only if behind reverse proxy e. g. nginx
    app.setGlobalPrefix(configService.get('API_PREFIX') || '/api')
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                const result = {}

                errors.forEach(error => {
                    const constraints = Object.values(error.constraints)
                    result[error.property] = constraints[0]
                })
                
                throw new HttpException({
                    statusCode: 400,
                    message: 'Input data validation failed',
                    errors: result
                }, HttpStatus.BAD_REQUEST)
            }
        })
    )

    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(Number(configService.get('APP_PORT')))
    
    return app
}

void bootstrap().catch(err => {
    console.error(err)
    process.exit(1)
})