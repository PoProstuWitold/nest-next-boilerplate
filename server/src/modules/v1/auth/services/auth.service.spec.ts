import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'

describe('UserService', () => {
    let module: TestingModule
    let service: AuthService

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn().mockResolvedValue({}),
                        login: jest.fn().mockResolvedValue({}),
                        logout: jest.fn().mockResolvedValue({}),
                        socialProviderLogin: jest.fn().mockResolvedValue({}),
                    }
                }
            ]
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    afterAll(async () => {
        module.close()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})