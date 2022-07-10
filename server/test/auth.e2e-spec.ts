import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { getQueueToken } from '@nestjs/bull';

import { createTestConfiguration, mailQueue } from './test-utils';
import { mockLocalUser } from './mocks/user.mock'
import { V1Module } from '../src/modules/v1/v1.module';
import { MainController } from '../src/modules/app.controller';
import { UserRepository } from '../src/modules/v1/user/repositories/user.repository';
import { User } from '../src/common/entities';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { WsEmitterClientOptions, WsEmitterModule } from '../src/modules/v1/chat/ws-emitter.module';
import { Room } from '../src/modules/v1/room/room.entity';
import { Message } from '../src/modules/v1/message/message.entity';

describe('AuthController (e2e)', () => {
    let moduleFixture: TestingModule
    let app: INestApplication
    let repository: UserRepository

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                TypeOrmModule.forRootAsync(createTestConfiguration([User, Room, Message])),
                V1Module,
                RedisModule.forRootAsync({
                    useFactory: async (): Promise<RedisModuleOptions> => {
                        return {
                            config: {
                                host: 'localhost',
                                port: 6379,
                            }
                        }
                    }
                }),
                WsEmitterModule.registerAsync({
                    useFactory: async (): Promise<WsEmitterClientOptions> => {
                        return {
                            config: {
                                host: 'localhost',
                                port: 6379,
                            }
                        }
                    }
                })
            ],
            controllers: [MainController]
        })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .overrideProvider(getQueueToken('mail-queue'))
        .useValue(mailQueue)
        .compile()

        app = moduleFixture.createNestApplication()
        repository = moduleFixture.get<UserRepository>(getRepositoryToken(User))
        await app.init()
    })

    beforeEach( async () => {
        await repository.query(`DELETE FROM "user"`)
    })

    afterEach( async () => {
        await repository.query(`DELETE FROM "user"`)
    })

    afterAll( async () => {
        await repository.query(`DELETE FROM "user"`)
        await app.close()
    })

    describe('/auth/local/register (POST)', () => {
        it('should register user if provided data is correct', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/local/register')
                .send(mockLocalUser)
                .expect((response: request.Response) => {
                    const { user } = response.body
                    const { id, email, password, firstName, lastName, displayName  } = user
    
                    expect(typeof id).toBe('string')
                    expect(firstName).toEqual(mockLocalUser.firstName),
                    expect(lastName).toEqual(mockLocalUser.lastName),
                    expect(displayName).toEqual(mockLocalUser.displayName)
                    expect(email).toEqual(mockLocalUser.email),
                    expect(password).toBeUndefined()
                })
                .expect(HttpStatus.CREATED)
                expect(response.get('Set-Cookie')).toBeDefined()
        })
    })

    describe('/auth/local/login (POST)', () => {
        it('should return user if credentials are correct', async () => {
            const response1 = await request(app.getHttpServer())
                .post('/auth/local/register')
                .send(mockLocalUser)
                .expect(HttpStatus.CREATED)
            const response2 = await request(app.getHttpServer())
                .post('/auth/local/login')
                .send({ email: mockLocalUser.email, password: mockLocalUser.password })
                .expect((response: request.Response) => {
                    const { user } = response.body
                    const { id, email, password, firstName, lastName, displayName  } = user
    
                    expect(typeof id).toBe('string')
                    expect(firstName).toEqual(mockLocalUser.firstName),
                    expect(lastName).toEqual(mockLocalUser.lastName),
                    expect(displayName).toEqual(mockLocalUser.displayName)
                    expect(email).toEqual(mockLocalUser.email),
                    expect(password).toBeUndefined()
                })
                .expect(HttpStatus.OK)
                expect(response1.get('Set-Cookie')).toBeDefined()
                expect(response2.get('Set-Cookie')).toBeDefined()
        })
    })

    describe('/auth/logout (DELETE)', () => {
        it('should logout user', async () => {
            const response1 = await request(app.getHttpServer())
                .post('/auth/local/register')
                .send(mockLocalUser)
                .expect(HttpStatus.CREATED)
                expect(response1.get('Set-Cookie')).toBeDefined()
                const cookie = response1.get('Set-Cookie')[0]
            const response2 = await request(app.getHttpServer())
                .delete('/auth/logout')
                .set('Cookie', cookie)
                .expect(HttpStatus.OK)
                expect(response2.get('Set-Cookie')[0]).toEqual(
                    'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                )
                expect(response2.get('Set-Cookie')[1]).toEqual(
                    'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                )
        })
    })

    describe('/auth/me (GET)', () => {
        it('should get user', async () => {
            const response1 = await request(app.getHttpServer())
                .post('/auth/local/register')
                .send(mockLocalUser)
                .expect(HttpStatus.CREATED)
                expect(response1.get('Set-Cookie')).toBeDefined()
                
                const cookie = response1.get('Set-Cookie')
            const response2 = await request(app.getHttpServer())
                .get('/auth/me')
                .set('Cookie', cookie)
                .expect(HttpStatus.OK)
        })
    })
})
