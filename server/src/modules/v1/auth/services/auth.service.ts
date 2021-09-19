import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'modules/v1/user/user.service';
import { JwtAccessPayload } from '../dto/jwt-access.payload';
import * as argon2 from 'argon2'
import { LoginDto } from 'common/dtos';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}

    async register(registrationData, req) {
        try {
            const user = await this.userService.create({
                ...registrationData
            })
            const accessToken = await this.createAccessToken(user)
            this.setTokens(req, accessToken)
            return {
                user,
                accessToken
            }

        } catch (err) {
            
        }
    }

    async createAccessToken(user: any) {
        const payload: JwtAccessPayload = { displayName: user.displayName, id: user.id }
        const accessToken = this.jwtService.sign(payload)
        return accessToken
    }

    async login(credentials: LoginDto, req: Request) {
        const { email, password } = credentials

        const user = await this.getAuthenticatedUser(email, password)
        const accessToken = await this.createAccessToken(user)

        await this.setTokens(req, accessToken)

        return {
            user,
            accessToken
        }
    }

    private async setTokens(req: Request, accessToken: any) {
        req.res.cookie('access_token', 
            accessToken, {
            expires: new Date(this.configService.get('JWT_ACCESS_EXPIRATION_TIME') * 1000 + Date.now()), 
            httpOnly: true, 
            sameSite: 'lax'
        })
    }


    async logout(req) {
        req.res.clearCookie('access_token')
    }

    public async validateUser(payload: JwtAccessPayload) {
        const user = await this.userService.getUserById(payload.id);

        if (!user) {
            throw new HttpException('Invalid tokens', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    public async getAuthenticatedUser(email: string, password: string) {
        try {
            const user = await this.userService.getByEmail(email)
            if(!user) {
                throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
            }

            const isMatch = await argon2.verify(user.password, password)
            if(!isMatch) {
                throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
            }
            return user
        } catch (err) {
            console.log(err)
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
        }
    }


    async googleLogin(req: Request) {
        const user = await this.userService.continueWithProvider(req)
        const accessToken = await this.createAccessToken(user)
        this.setTokens(req, accessToken)

        await req.res.redirect('/api/v1/auth/me')

        return {
            user,
            accessToken
        }
    }
}
