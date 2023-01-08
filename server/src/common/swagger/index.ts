import { INestApplication, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import {
  SWAGGER_API_ROOT,
  SWAGGER_API_NAME,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_CURRENT_VERSION,
} from './constants'

export const setupSwagger = (app: INestApplication) => {
	const server = 'http://localhost:4000/api'
	const docs = 'http://localhost:4000/api/docs'

    const options = new DocumentBuilder()
        .setTitle(SWAGGER_API_NAME)
        .setDescription(SWAGGER_API_DESCRIPTION)
        .setVersion(SWAGGER_API_CURRENT_VERSION)
        .addCookieAuth()
        .addServer(server)
        .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(SWAGGER_API_ROOT, app, document)

    const logger = new Logger('Documentation')
	logger.log(`API Documentation for "${server}" is avaible at "${docs}"`)
}