import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UserService } from '../../../../modules/v1/user/services/user.service'

export type JwtAccessPayload = {
    id: string | number;
    displayName: string 
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        configService: ConfigService,
        private readonly userService: UserService
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
        const user = await this.userService.getUserByField('id', payload.id)

        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        
        return user
    }
}