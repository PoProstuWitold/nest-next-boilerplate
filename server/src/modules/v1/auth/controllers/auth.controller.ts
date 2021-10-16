import { Body, Controller, Delete, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RateLimit } from 'nestjs-rate-limiter'
import { AuthService } from '../services/auth.service';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateAccountDto, LoginDto } from '../../../../common/dtos';
import { FacebookOauthGuard } from '../guards/facebook.-oauth.guard';

@ApiTags('v1/auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    
    @ApiCreatedResponse({
        description: 'Create an account with provided data if correct'
    })
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

    @ApiOkResponse({
        description: 'Logs in user'
    })
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

    @ApiCookieAuth()
    @ApiOkResponse({
        description: 'Logs out user'
    })
    @Delete('logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @Req() req: Request
    ) {
        return this.authService.logout(req)
    }

    
    @ApiOkResponse({
        description: 'Basic URL to initiate Google Strategy (NOT WORKING IN SWAGGER)'
    })
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @ApiOkResponse({
        description: 'Redirect URL for Google Strategy (NOT WORKING IN SWAGGER)'
    })
    @Get('google/redirect')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.socialProviderLogin(req)
    }

    @ApiOkResponse({
        description: 'Basic URL to initiate Google Strategy (NOT WORKING IN SWAGGER)'
    })
    @Get('facebook')
    @UseGuards(FacebookOauthGuard)
    async facebookAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @ApiOkResponse({
        description: 'Redirect URL for Google Strategy (NOT WORKING IN SWAGGER)'
    })
    @Get('facebook/redirect')
    @UseGuards(FacebookOauthGuard)
    async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.socialProviderLogin(req)
    }

    @ApiCookieAuth()
    @ApiOkResponse({
        description: 'Currently logged user profile'
    })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: Request) {
        return req.user
    }

}
