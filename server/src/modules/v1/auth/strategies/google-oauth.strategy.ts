import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../../modules/v1/user/services/user.service';
import Providers from '../types/providers.enum';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
        // Put config in `.env`
            clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
            clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
            callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
            scope: ['email', 'profile']
        });
    }

    async validate(
        accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback
    ): Promise<any> {
        try {
            const { id, name, emails } = profile

            const user = {
                provider: Providers.Google,
                providerId: id,
                email: emails[0].value,
                password: 'provided',
                firstName: name.givenName,
                lastName: name.familyName,
                displayName: profile.displayName,
                accessToken
            }
            
            return user
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException()
        }
    }
}