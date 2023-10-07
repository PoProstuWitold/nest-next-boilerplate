import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

import { AuthRequest, AuthService } from './auth.service';
import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../../../common/dtos';
import { RolesGuard, VerifiedGuard, FacebookOauthGuard, GoogleOauthGuard, JwtAuthGuard } from '../../../common/guards';
import { Roles, CurrentUser, Verified as Status } from '../../../common/decorators';
import { Providers, Role, AccountStatus } from '../../../common/enums';
import { User } from '../../../common/entities';

@ApiTags('v1/auth')
@Controller({
    path: 'auth',
    version: '1'
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    
    @ApiCreatedResponse({
        description: 'Create an account with provided data if correct'
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
    @HttpCode(200)
    @Post('local/login')
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
    async googleAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
        return this.authService.socialProviderLogin(req, Providers.Google)
    }

    @ApiOkResponse({
        description: 'Basic URL to initiate Facebook Strategy (NOT WORKING IN SWAGGER)'
    })
    @Get('facebook')
    @UseGuards(FacebookOauthGuard)
    async facebookAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @ApiOkResponse({
        description: 'Redirect URL for Facebook Strategy (NOT WORKING IN SWAGGER)'
    })
    @Get('facebook/redirect')
    @UseGuards(FacebookOauthGuard)
    async facebookAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
        return this.authService.socialProviderLogin(req, Providers.Facebook)
    }

    @ApiCookieAuth()
    @ApiOkResponse({
        description: 'Currently logged user profile'
    })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @SkipThrottle({ default: false })
    getProfile(@Req() req: Request) {
        return this.authService.getProfile(req)
    }

    @ApiCookieAuth()
    @ApiOkResponse({
        description: 'Admin restricted resource'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin')
    getAdminData() {
        return 'only admins should see this'
    }

    @ApiOkResponse({
        description: 'Confirm account'
    })
    @Status(AccountStatus.PENDING)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get('account/confirm')
    confirmAccount(
        @CurrentUser() user: User,
        @Query('token') token: string
    ) {
        return this.authService.confirmAccount(user, token)
    }

    @ApiOkResponse({
        description: 'Resend confirmation token'
    })
    @Status(AccountStatus.PENDING)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get('account/confirm-resend')
    resendConfirmToken(
        @CurrentUser() user: User
    ) {
        return this.authService.resendConfirmationToken(user)
    }

    @ApiOkResponse({
        description: 'Reset your password'
    })
    @Patch('password/reset')
    resetPassword(
        @Body('email') email: string
    ) {
        return this.authService.resetPassword(email)
    }

    @ApiOkResponse({
        description: 'Change your password'
    })
    @Patch('password/change')
    @Status(AccountStatus.VERIFIED)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    changePassword(
        @CurrentUser() user: User,
        @Body() passwordValues: PasswordValuesDto
    ) {
        return this.authService.changePassword(user, passwordValues)
    }
    @ApiOkResponse({
        description: 'Set new password'
    })
    @Patch('password/new')
    setNewPassword(
        @Body('newPassword') newPassword: string,
        @Query('token') token: string
    ) {
        return this.authService.setNewPassword(newPassword, token)
    }

}
