import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../../../modules/v1/user/services/user.service';
import { JwtAccessPayload } from '../dto/jwt-access.payload';
import * as argon2 from 'argon2'
import { CreateAccountDto, LoginDto } from '../../../../common/dtos';
import { ConfigService } from '@nestjs/config';
import { UniqueViolation, InvalidCredentials, SocialProvider } from '../../../../common/exceptions';
import PostgresErrorCode from '../../../../common/enums/postgres-errors.enum';
import Providers from '../types/providers.enum';
import { User } from 'common/entities';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}

    public async register(registrationData: CreateAccountDto, req: Request) {
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

    private async createAccessToken(user: User) {
        const payload: JwtAccessPayload = { displayName: user.displayName, id: user.id }
        const accessToken = this.jwtService.sign(payload)
        return accessToken
    }

    public async login(credentials: LoginDto, req: Request) {
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

    private async setTokens(req: Request, accessToken: string) {
        req.res.cookie('access_token', 
            accessToken, {
            expires: new Date(this.configService.get('JWT_ACCESS_EXPIRATION_TIME') * 1000 + Date.now()), 
            httpOnly: true, 
            sameSite: 'lax'
        })
    }


    public async logout(req: Request) {
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
                throw new InvalidCredentials()
            }

            if(user.provider !== Providers.Local) {
                throw new SocialProvider()
            }

            const isMatch = await argon2.verify(user.password, password)
            if(!isMatch) {
                throw new InvalidCredentials()
            }
            return user
        } catch (err) {
            throw err
        }
    }


    public async socialProviderLogin(req: Request) {
        const user = await this.userService.continueWithProvider(req)
        const accessToken = await this.createAccessToken(user)
        this.setTokens(req, accessToken)

        // req.res.redirect('/api/v1/auth/me')
        req.res.redirect(`${process.env.ORIGIN}/me`)

        return {
            user,
            accessToken
        }
    }
}
