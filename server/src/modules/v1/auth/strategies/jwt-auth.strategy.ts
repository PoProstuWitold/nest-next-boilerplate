import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export type JwtPayload = { sub: string | number; displayName: string }

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const extractJwtFromCookie = (req) => {
            let token = null

            if (req && req.cookies) {
                token = req.cookies['access_token']
            }
            
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req)
        }

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY')
        })
    }

    extractJwtFromCookie(req) {
        let token = null

        if (req && req.cookies) {
            token = req.cookies['access_token']
        }

        return token
    }

    async validate(payload: JwtPayload) {
        return { id: payload.sub, displayName: payload.displayName }
    }
}