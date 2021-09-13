import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './modules/main/app.module'
import { setupSwagger } from './swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    setupSwagger(app)
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(3000)
}

void bootstrap()
