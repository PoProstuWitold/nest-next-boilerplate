import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './services/auth.service'

describe('AuthController', () => {
    let module: TestingModule
    let controller: AuthController
    let service: AuthService
    
    beforeEach(async () => {
        module = await Test.createTestingModule({
            controllers: [AuthController],
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
        controller = module.get<AuthController>(AuthController)
    })

    afterAll(async () => {
        module.close()
    })

    it('Should be defined', () => {
        expect(controller).toBeDefined()
    })
})
