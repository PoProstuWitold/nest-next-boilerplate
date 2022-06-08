import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../../../modules/v1/user/services/user.service';
import * as argon2 from 'argon2'
import { CreateAccountDto, LoginDto } from '../../../../common/dtos';
import { ConfigService } from '@nestjs/config';
import { UniqueViolation, InvalidCredentials, SocialProvider } from '../../../../common/exceptions';
import PostgresErrorCode from '../../../../common/enums/postgres-errors.enum';
import Providers from '../../../../common/enums/providers.enum';
import { User } from '../../../../common/entities';

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

            const [accessToken] = await this.generateTokens(user)

            await this.setTokens(req, { accessToken })

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

    public async login(credentials: LoginDto, req: Request) {
        try {
            const { email, password } = credentials

            const user = await this.getAuthenticatedUser(email, password)
            const [accessToken] = await this.generateTokens(user)

            await this.setTokens(req, { accessToken })

            return {
                user,
                accessToken
            }
        } catch (err) {
            throw new HttpException(err.response, err.status)
        }
    }

    public async logout(req: Request) {
        req.res.clearCookie('access_token')
        req.res.clearCookie('refresh_token')
    }

    private async generateTokens(user: User) {
        const accessToken = await this.jwtService.signAsync({ 
            displayName: user.displayName,
            id: user.id
        }, {
            issuer: 'PoProstuWitold',
            expiresIn: '30m'
        })

        const refreshToken = await this.jwtService.signAsync({}, {
            issuer: 'PoProstuWitold',
            expiresIn: '30d',
        })

        return [
            accessToken, refreshToken
        ]
    }

    private async setTokens(req: Request, { accessToken, refreshToken }: { accessToken: string, refreshToken?: string}) {
        req.res.cookie('access_token', 
            accessToken, {
            expires: new Date(this.configService.get('JWT_ACCESS_EXPIRATION_TIME') * 1000 + Date.now()), 
            httpOnly: true, 
            sameSite: 'lax'
        })

        req.res.cookie('refresh_token', 
            refreshToken, {
            expires: new Date(this.configService.get('JWT_ACCESS_EXPIRATION_TIME') * 1000 + Date.now()),
            httpOnly: true,
            sameSite: true,
        })
    }

    public async getAuthenticatedUser(email: string, password: string) {
        try {
            const user = await this.userService.getUserByField('email', email)
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
        const [accessToken] = await this.generateTokens(user)
        await this.setTokens(req, { accessToken })

        // req.res.redirect('/api/v1/auth/me')
        req.res.redirect(`${process.env.ORIGIN}/me`)

        return {
            user,
            accessToken
        }
    }
}
