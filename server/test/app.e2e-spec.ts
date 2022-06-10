import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTestConfiguration } from './test-utils';
import { User } from '../src/common/entities';
import { V1Module } from '../src/modules/v1/v1.module';
import { MainController } from '../src/modules/app.controller';
import { MailModule } from '../src/modules/mailer/mailer.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

describe('AppController (e2e)', () => {
    let app: INestApplication
    let moduleFixture: TestingModule
    let client: Redis

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                TypeOrmModule.forRootAsync(createTestConfiguration([User])),
                V1Module,
                MailModule,
                RedisModule.forRoot({
                    config: {
                        host: 'localhost',
                        port: 6379,
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
