import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAccessPayload } from '../types/jwt-access.payload'
import { AuthService } from '../services/auth.service'
import { Request } from 'express'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: JwtAuthStrategy.extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY')
        })
    }

    static extractJwtFromCookie(req: Request) {
        let token = null

        if (req && req.cookies) {
            token = req.cookies['access_token']
        }
        
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    }

    async validate(payload: JwtAccessPayload) {
        const user = await this.authService.validateUser(payload)
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user
    }
}