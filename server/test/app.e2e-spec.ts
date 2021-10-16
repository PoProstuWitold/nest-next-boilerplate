import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTestConfiguration } from './test-utils';
import { User } from '../src/common/entities';
import { V1Module } from '../src/modules/v1/v1.module';
import { MainController } from '../src/modules/app.controller';

describe('AppController (e2e)', () => {
    let app: INestApplication
    let moduleFixture: TestingModule
    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                TypeOrmModule.forRootAsync(createTestConfiguration([User])),
                V1Module
            ],
            controllers: [MainController]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterEach( async () => {
        await app.close()
    })

    it('/ (GET)', () => {
        return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('NestJS NextJS Boilerplate by PoProstuWitold v1')
    })
})
