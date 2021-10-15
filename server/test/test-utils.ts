import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { EntitySchema } from 'typeorm'

type Entity = Function | string | EntitySchema<any>

export const createTestConfiguration = (
  entities: Entity[],
) => ({
    imports: [
        ConfigModule
    ],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return {
            type: 'postgres',
            host: 'localhost',
            port: 5431,
            username: 'tests',
            password: 'tests',
            database: 'postgres-tests',
            entities,
            synchronize: true,
            // tests fail at first launch because relation "user" does not exist
            // dropSchema: true
        } as TypeOrmModuleOptions
    }
})

export const createJwtConfiguration = () => (
    {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_ACCESS_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get('JWT_ACCESS_EXPIRATION_TIME')
                }
        })
    }
)