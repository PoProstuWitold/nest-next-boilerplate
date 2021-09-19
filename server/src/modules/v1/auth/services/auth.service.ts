import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'modules/v1/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async register() {

    }

    async login(user: any) {
        const payload = { displayName: user.displayName, sub: user.id }
        const accessToken = this.jwtService.sign(payload)
        return accessToken
    }

    async logout() {
        
    }

    async googleLogin(req: Request) {
        const user = await this.userService.continueWithProvider(req)
        await this.login(user)
        const accessToken = await this.login(user)
        req.res.cookie('access_token', accessToken)

        return {
            user,
            accessToken
        }
    }
}
