import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../../../modules/v1/user/services/user.service';
import * as argon2 from 'argon2'
import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../../../../common/dtos';
import { ConfigService } from '@nestjs/config';
import { UniqueViolation, InvalidCredentials, SocialProvider } from '../../../../common/exceptions';
import PostgresErrorCode from '../../../../common/enums/postgres-errors.enum';
import Providers from '../../../../common/enums/providers.enum';
import { User } from '../../../../common/entities';
import { MailerService } from '@nestjs-modules/mailer';
import { nanoid } from 'nanoid'
import { AccountStatus } from '../../../../common/enums/status.enum';
import { RedisService } from '@liaoliaots/nestjs-redis';

export interface AuthRequest extends Request {
    user: IUser
}

interface IUser extends User {
    verified?: boolean;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
        private readonly redisService: RedisService
    ) {}

    public async register(registrationData: CreateAccountDto, req: Request) {
        try {
            const user = await this.userService.create({
                ...registrationData
            })

            await this.sendConfirmationToken(user)

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


    public async socialProviderLogin(req: AuthRequest, provider: Providers) {
        try {
            if(provider === Providers.Google) {
                if(!req.user.verified) {
                    throw new BadRequestException('This Google account is not verified')
                }
            }
            const user = await this.userService.continueWithProvider(req)
            const [accessToken] = await this.generateTokens(user)
            await this.setTokens(req, { accessToken })
    
            // req.res.redirect('/api/v1/auth/me')
            req.res.redirect(`${process.env.ORIGIN}/me`)
    
            return {
                user,
                accessToken
            }
        } catch (err) {
            req.res.redirect(`${process.env.ORIGIN}/login/error?message=${err.response.message}`)
        }
    }

    private async sendConfirmationToken(user: User) {
        const token = nanoid()

            await this.redisService.getClient().set(`confirm-account:${token}`, user.id, 'EX', 1000 * 60 * 60 * 1) // 1 hour until expires

            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Confirm your email',
                template: 'confirm-email',
                context: {
                    token
                }
            })
    }

    private async sendResetToken(user: User) {
        const token = nanoid()

            await this.redisService.getClient().set(`reset-password:${token}`, user.id, 'EX', 1000 * 60 * 60 * 1) // 1 hour until expires

            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Reset your password',
                template: 'reset-password',
                context: {
                    token
                }
            })
    }

    public async confirmAccount(user: User, token: string) {
        const accountId = await this.redisService.getClient().get(`confirm-account:${token}`)

        if(!accountId) {
            if(user.accountStatus === AccountStatus.VERIFIED) {
                return {
                    success: true,
                    message: "Account already verified"
                }
            }
            
            return {
                success: false,
                message: "Confirmation token expired"
            }
        }

        if(user.id === accountId) {
            await this.userService.update(user.id, {
                accountStatus: AccountStatus.VERIFIED
            })

            await this.redisService.getClient().del(`confirm-account:${token}`)
        }
        return {
            success: true,
            message: "Account verified successfully"
        }
    }

    public async resendConfirmationToken(user: any) {
        this.sendConfirmationToken(user)

        return {
            success: true,
            message: "Confirmation token resend. Check your email"
        }
    }

    public async resetPassword(email: string) {
        const user = await this.userService.getUserByField('email', email)
        // if(user && user.provider === Providers.Local) {
        //     this.sendResetToken(user)
        // }
        // console.log(user)
        // console.log(email)

        if(user) {
            // if(user.provider !== Providers.Local) {
            //     throw new BadRequestException(`You can't reset password while using social provider`)
            // }
            this.sendResetToken(user)
        }

        return {
            success: true,
            message: "If the account exists and it isn't registered with social provider, an email with a password reset link has been sent to",
            email
        }
    }

    public async changePassword(user: User, password: PasswordValuesDto) {
        if(user.provider !== Providers.Local) {
            throw new BadRequestException(`You can't change password while using social provider`)
        }

        const authUser = await this.getAuthenticatedUser(user.email, password.oldPassword)

        if(password.newPassword === password.oldPassword) {
            throw new BadRequestException(`New password cannot be same as old`)
        }

        if(authUser) {
            this.userService.update(user.id, { password: await argon2.hash(password.newPassword)})
            return {
                success: true,
                message: "Password changed"
            }
        }
    }

    public async setNewPassword(newPassword: string, token: string) {
        const accountId = await this.redisService.getClient().get(`reset-password:${token}`)

        const user = await this.userService.getUserByField('id', accountId)

        if(!accountId) {
            throw new BadRequestException('Reset password token expired')
        }

            await this.userService.update(user.id, {
                password: await argon2.hash(newPassword)
            })

            await this.redisService.getClient().del(`reset-password:${token}`)

        return {
            success: true,
            message: "Password reseted"
        }
    }
}
