import { config } from 'dotenv'
config()
import { NestFactory, Reflector } from '@nestjs/core'
import { BadRequestException, ClassSerializerInterceptor, ValidationError, ValidationPipe } from '@nestjs/common'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { useContainer } from 'class-validator'
import { AppModule } from './modules/app.module'
import { setupSwagger } from './common/swagger'
import * as express from 'express'
import { ConfigService } from '@nestjs/config'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as RateLimit from 'express-rate-limit'
import * as compression from 'compression'
import * as passport from 'passport'

export async function bootstrap(): Promise<NestExpressApplication> {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        {
            cors: true
        }
    )

    // GLOBAL MIDDLEWARES
    app.use(express.json())
    app.use(cookieParser())
    app.use(helmet())
    app.use(
        RateLimit({
            windowMs: 15 * 60 * 1000, //15 minutes
            max: 100 //100 IP requests per windowsMs
        })
    )
    app.use(compression())

    const configService = app.get<ConfigService>(ConfigService)
    const reflector = app.get(Reflector)


    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

    if(configService.get('SWAGGER')) {
        setupSwagger(app)
    }

    // app.enable('trust proxy') //only if behind reverse proxy e. g. nginx
    app.setGlobalPrefix(configService.get('API_PREFIX') || '/api/v1/')
    app.useGlobalPipes(new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => {
            new BadRequestException(errors)
        }
    }))



    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(Number(configService.get('APP_PORT')))
    
    return app
}

void bootstrap().catch(err => {
    console.error(err)
    process.exit(1)
})