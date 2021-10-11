import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { V1Module } from './v1/v1.module'
import { MainController } from './app.controller'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [
                ConfigModule
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: configService.get('DB_TYPE'),
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + './../**/**.entity{.ts,.js}'],
                    synchronize: configService.get('DB_SYNC') === 'true'
                } as TypeOrmModuleAsyncOptions
            }
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        V1Module
    ],
    controllers: [MainController],
    providers: []
})
export class AppModule {}
