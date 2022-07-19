import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { RedisService } from '@liaoliaots/nestjs-redis'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { BullModule, BullModuleOptions } from '@nestjs/bull'

import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { UserModule } from '../../user/user.module'
import { User } from '../../../../common/entities'
import { createJwtConfiguration, createTestConfiguration } from '../../../../../test/test-utils'
import { UserRepository } from '../../user/repositories/user.repository'
import { WsEmitterClientOptions, WsEmitterModule } from '../../../../modules/v1/chat/ws-emitter.module'
import { Invitation, Room } from '../../room/entities'
import { Message } from '../../message/message.entity'

describe('AuthController', () => {
    let module: TestingModule
    let controller: AuthController
    let service: AuthService
    let repository: UserRepository

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                UserModule,
                TypeOrmModule.forRootAsync(createTestConfiguration([User, Room, Message, Invitation])),
                TypeOrmModule.forFeature([User]),
                JwtModule.registerAsync(createJwtConfiguration()),
                BullModule.registerQueueAsync({
                    name: 'mail-queue',
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => ({
                        redis: {
                            host: configService.get('REDIS_HOST') || 'localhost',
                            port: configService.get('REDIS_PORT') || 6379
                        }
                    })
                }),
                WsEmitterModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService): Promise<WsEmitterClientOptions> => {
                        return {
                            config: {
                                host: configService.get('REDIS_HOST') || 'localhost',
                                port: configService.get('REDIS_PORT') || 6379,
                            }
                        }
                    }
                })
            ],
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: RedisService,
                    useValue: {
                      get: jest.fn(),
                      getClient: jest.fn().mockReturnValue({}),
                    }
                }
            ]
        }).compile()
        controller = module.get<AuthController>(AuthController)
        service = module.get<AuthService>(AuthService)
        repository = module.get<UserRepository>(getRepositoryToken(User))
        await repository.query(`DELETE FROM "user"`)
    })

    afterAll(async () => {
        await repository.query(`DELETE FROM "user"`)
        module.close()
    })

    it('Should be defined', () => {
        expect(module).toBeDefined()
    })

    it('Should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('Should be defined', () => {
        expect(service).toBeDefined()
    })
})
