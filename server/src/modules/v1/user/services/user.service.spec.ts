import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'

describe('UserService', () => {
    let module: TestingModule
    let service: UserService

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn().mockResolvedValue({}),
                        getUserById: jest.fn().mockResolvedValue({}),
                        getByEmail: jest.fn().mockResolvedValue({}),
                        continueWithProvider: jest.fn().mockResolvedValue({})
                    }
                }
            ]
        }).compile()

        service = module.get<UserService>(UserService)
    })

    afterAll(async () => {
        module.close()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})