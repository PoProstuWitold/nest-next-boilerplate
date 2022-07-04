import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError,  } from 'jsonwebtoken'

import { AuthService } from '../../modules/v1/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super()
    }
    handleRequest(err, user, info, context) {
        if(info) {
            if(info instanceof TokenExpiredError && context.getRequest().cookies['refresh_token'] ) {
                return this.authService.refreshTokens(context.getRequest())
            }
            if(info instanceof Error && info.message === 'No auth token' && context.getRequest().cookies['refresh_token'] && !context.getRequest().cookies['access_token']) {
                return this.authService.refreshTokens(context.getRequest())
            }
        }
        if (err || !user) {
            throw err || new UnauthorizedException()
        }
        return user
    }
}