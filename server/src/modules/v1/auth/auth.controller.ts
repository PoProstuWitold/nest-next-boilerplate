import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RateLimit } from 'nestjs-rate-limiter'
import { AuthService } from './auth.service';

@ApiTags('v1/auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    @RateLimit({
        points: 1,
        duration: 120,
        errorMessage: 'You have reached the limit. You have to wait 2 minutes before trying again.'
    })
    @Post('register')
    async register() {
        return this.authService.register()
    }

    @RateLimit({
        points: 5,
        duration: 300,
        errorMessage: 'You have reached the limit of login requests. You have to wait 5 minutes before trying again.'
    })
    @Post('login')
    async login() {
        return this.authService.login()
    }

    @ApiBearerAuth()
    @Post('logout')
    async logout() {
        return this.authService.logout()
    }
}
