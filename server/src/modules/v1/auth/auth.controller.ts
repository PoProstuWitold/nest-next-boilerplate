import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RateLimit } from 'nestjs-rate-limiter'
import { AuthService } from './services/auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateAccountDto, LoginDto } from 'common/dtos';

@ApiTags('v1/auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}
    
    @RateLimit({
        points: 1,
        duration: 120,
        errorMessage: 'You have reached the limit. You have to wait 2 minutes before trying again.'
    })
    @Post('local/register')
    async register(
        @Body() credentials: CreateAccountDto,
        @Req() req: Request
    ) {
        return this.authService.register(credentials, req)
    }

    @RateLimit({
        points: 5,
        duration: 300,
        errorMessage: 'You have reached the limit of login requests. You have to wait 5 minutes before trying again.'
    })
    @HttpCode(200)
    @Post('local/login')
    @UseGuards(LocalAuthGuard)
    async login(
        @Body() credentials: LoginDto,
        @Req() req: Request
    ) {
        return this.authService.login(credentials, req)
    }

    @ApiBearerAuth()
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @Req() req: Request
    ) {
        return this.authService.logout(req)
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @Get('google/redirect')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.googleLogin(req)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return req.user
    }

}
