import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'modules/v1/user/user.service';
import { JwtAccessPayload } from '../dto/jwt-access.payload';
import * as argon2 from 'argon2'
import { LoginDto } from 'common/dtos';
import { ConfigService } from '@nestjs/config';
import { UniqueViolation } from 'common/exceptions/unique-violation.exception';
import PostgresErrorCode from 'common/utils/postgres-errors.enum';
import Providers from '../types/providers.enum';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}

    async register(registrationData: any, req: Request) {
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
        } catch (err: any) {
            if(err.code == PostgresErrorCode.UniqueViolation) {
                if(err.detail.includes('email')) {
                    throw new UniqueViolation('email')
                }

                if(err.detail.includes('nick_name' || 'nick' || 'nickName')) {
                    throw new UniqueViolation('nickName')
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async createAccessToken(user: any) {
        const payload: JwtAccessPayload = { displayName: user.displayName, id: user.id }
        const accessToken = this.jwtService.sign(payload)
        return accessToken
    }

    async login(credentials: LoginDto, req: Request) {
        try {
            const { email, password } = credentials

            const user = await this.getAuthenticatedUser(email, password)
            const accessToken = await this.createAccessToken(user)

            await this.setTokens(req, accessToken)

            return {
                user,
                accessToken
            }
        } catch (err) {
            throw new HttpException(err.response, err.status)
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


    async logout(req: Request) {
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

            if(user.provider !== Providers.Local) {
                throw new HttpException('This user was already registered with social provider', HttpStatus.BAD_REQUEST)
            }

            const isMatch = await argon2.verify(user.password, password)
            if(!isMatch) {
                throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
            }
            return user
        } catch (err) {
            if(err.response.includes('provider' && 'social' )) {
                throw new HttpException('This user was already registered with social provider', HttpStatus.BAD_REQUEST)
            }
            // if(err.response.includes('Invalid' || 'credentials' )) {
            //     throw new HttpException('Invalid credentialssss', HttpStatus.BAD_REQUEST)
            // }
            throw err
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
