import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAccessPayload } from '../dto/jwt-access.payload'
import { AuthService } from '../services/auth.service'

const extractJwtFromCookie = (req) => {
    let token = null

    if (req && req.cookies) {
        token = req.cookies['access_token']
    }
    
    return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req)
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
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

    async validate(payload: JwtAccessPayload) {
        const user = await this.authService.validateUser(payload)
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user
        // return { id: payload.id, displayName: payload.displayName }
    }
}