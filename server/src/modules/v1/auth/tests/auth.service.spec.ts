import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisService } from '@liaoliaots/nestjs-redis'
import { BullModule, BullModuleOptions } from '@nestjs/bull'

import { User } from '../../../../common/entities'
import { UserRepository } from '../../../../modules/v1/user/repositories/user.repository'
import { createJwtConfiguration, createTestConfiguration } from '../../../../../test/test-utils'
import { AuthService } from '../auth.service'
import { LocalUser } from '../../../../../test/mocks/user.mock'
import { UserModule } from '../../../../modules/v1/user/user.module'
import { WsEmitterClientOptions, WsEmitterModule } from '../../../../modules/v1/chat/ws-emitter.module'
import { Room } from '../../room/room.entity'
import { Message } from '../../message/message.entity'
import { ConnectedUser, JoinedRoom } from '../../chat/entites'

describe('AuthService', () => {
    let module: TestingModule
    let service: AuthService
    let repository: UserRepository

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                UserModule,
                TypeOrmModule.forRootAsync(createTestConfiguration([User, Room, Message, ConnectedUser, JoinedRoom])),
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
            providers: [
                AuthService,
                {
                    provide: RedisService,
                    useValue: {
                      get: jest.fn(),
                      getClient: jest.fn().mockReturnValue({}),
                    }
                }
            ],
        }).compile()

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
        expect(service).toBeDefined()
    })

    it('Should be defined', () => {
        expect(repository).toBeDefined()
    })

    it('Should create local user', async () => {
        const user: User = repository.create(LocalUser)
        await repository.save(user)
        expect(user.email).toBe(user.email)
    })

    // it('Should thrown an error on duplicate unique key', async () => {
    //     const user: User = repository.create(LocalUser)
    //     await repository.save(user)
    //     await expect(
    //         repository.create(LocalUser)
    //     ).rejects.toThrowError(UniqueViolation)
    // })

    describe('When accessing the data of authenticating user', () => {
        describe('and the provided password is invalid', () => {
            it('should throw an error', async () => {
                await expect(
                    service.getAuthenticatedUser('test@email.com', 'keyboardcat2222')
                ).rejects.toThrow()
            })
        })
        describe('and the provided password is valid', () => {
            describe('and the email is found in the database', () => {
                it('should return the user data', async () => {
                    const user = await service.getAuthenticatedUser('test@email.com', 'keyboardcat')
                    expect(user.email).toBe(LocalUser.email)
                })
            })
            describe('and the email is not found in the database', () => {
                it('should throw an error', async () => {
                    await expect(
                        service.getAuthenticatedUser('test2@email.com', 'keyboardcat')
                    ).rejects.toThrow()
                })
            })
        })
    })
      
})