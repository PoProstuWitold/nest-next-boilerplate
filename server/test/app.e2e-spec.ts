import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { createTestConfiguration } from './test-utils';
import { User } from '../src/common/entities';
import { V1Module } from '../src/modules/v1/v1.module';
import { MainController } from '../src/modules/app.controller';
import { WsEmitterClientOptions, WsEmitterModule } from '../src/modules/v1/chat/ws-emitter.module';
import { Invitation, Room } from '../src/modules/v1/room/entities';
import { Message } from '../src/modules/v1/message/message.entity';
import { Conversation } from '../src/modules/v1/conversation/conversation.entity';

describe('AppController (e2e)', () => {
    let app: INestApplication
    let moduleFixture: TestingModule

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                TypeOrmModule.forRootAsync(createTestConfiguration([User, Room, Message, Invitation, Conversation])),
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
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterAll( async () => {
        await app.close()
    })

    it('/ (GET)', () => {
        return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('NestJS NextJS Boilerplate by PoProstuWitold v1')
    })
})
