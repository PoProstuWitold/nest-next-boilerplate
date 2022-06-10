import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from '../services/auth.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from '../../../../modules/v1/user/user.module'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../../../common/entities'
import { JwtModule } from '@nestjs/jwt'
import { createJwtConfiguration, createTestConfiguration } from '../../../../../test/test-utils'
import { UserRepository } from '../../../../modules/v1/user/repositories/user.repository'
import { MailModule } from '../../../../modules/mailer/mailer.module'
import { RedisService } from '@liaoliaots/nestjs-redis'

describe('AuthController', () => {
    let module: TestingModule
    let controller: AuthController
    let service: AuthService
    let repository: UserRepository

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                UserModule,
                TypeOrmModule.forRootAsync(createTestConfiguration([User])),
                TypeOrmModule.forFeature([User]),
                JwtModule.registerAsync(createJwtConfiguration()),
                MailModule
            ],
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: RedisService,
                    useValue: {
                      get: jest.fn(),
                      getClient: jest.fn().mockReturnValue({}),
                    }
                }
            ]
        }).compile()
        controller = module.get<AuthController>(AuthController)
        service = module.get<AuthService>(AuthService)
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
        expect(controller).toBeDefined()
    })

    it('Should be defined', () => {
        expect(service).toBeDefined()
    })
})
