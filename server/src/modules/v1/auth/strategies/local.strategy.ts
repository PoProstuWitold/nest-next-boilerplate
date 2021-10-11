import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { User } from '../../../../common/entities'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email'
        })
    }

    async validate(email: string, password: string): Promise<User> {
        return this.authService.getAuthenticatedUser(email, password)
    }
}