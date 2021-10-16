import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../../../common/entities'
import { createTestConfiguration } from '../../../../../test/test-utils'
import { UserRepository } from '../repositories/user.repository'
import { UserService } from './user.service'
import { LocalUser } from '../../../../../test/mocks/user.mock'
import { v4 as uuidv4 } from 'uuid'

describe('UserService', () => {
    let module: TestingModule
    let service: UserService
    let repository: UserRepository
    let userId: string

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                TypeOrmModule.forRootAsync(createTestConfiguration([User])),
                TypeOrmModule.forFeature([User])
            ],
            providers: [
                UserService
            ]
        }).compile()

        service = module.get<UserService>(UserService)
        repository = module.get<UserRepository>(getRepositoryToken(User))
        repository.clear()
    })

    afterAll(async () => {
        repository.clear()
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

    it('Should create and return a user', async () => {
        const { displayName, email, firstName, lastName, password } = LocalUser
        const data = { displayName, email, firstName, lastName, password }
        const user = await service.create(data)
        userId = user.id
        expect(user).toBeInstanceOf(User)
    })

    describe('When providing', () => {
        describe('email', () => {
            describe('and the email is found in the database', () => {
                it('should return the user data', async () => {
                    const user = await service.getByEmail('test@email.com')
                    expect(user.email).toBe(LocalUser.email)
                })
            })
            describe('and the email is not found in the database', () => {
                it('should throw an error', async () => {
                    expect(
                        await service.getByEmail('test2@email.com')
                    ).toBeUndefined()
                })
            })
        })
        describe('id', () => {
            describe('and the id is found in the database', () => {
                it('should return the user data', async () => {
                    const user = await service.getUserById(userId)
                    expect(user.id).toBe(userId)
                })
            })
            describe('and the id is not found in the database', () => {
                it('should throw an error', async () => {
                    expect(
                        await service.getUserById(uuidv4())
                    ).toBeUndefined()
                })
            })
        })
    })
})