import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'

import { User } from '../../../../common/entities'
import { createTestConfiguration } from '../../../../../test/test-utils'
import { UserRepository } from '../repositories/user.repository'
import { UserService } from '../user.service'
import { UserController } from '../user.controller'
import { Invitation, Room } from '../../room/entities'
import { Message } from '../../message/message.entity'
import { Conversation } from '../../conversation/conversation.entity'

describe('UserController', () => {
    let module: TestingModule
    let service: UserService
    let repository: UserRepository
    let controller: UserController

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                TypeOrmModule.forRootAsync(createTestConfiguration([User, Room, Message, Invitation, Conversation])),
                TypeOrmModule.forFeature([User])
            ],
            controllers: [
                UserController
            ],
            providers: [
                UserService
            ]
        }).compile()

        controller = module.get<UserController>(UserController)
        service = module.get<UserService>(UserService)
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
