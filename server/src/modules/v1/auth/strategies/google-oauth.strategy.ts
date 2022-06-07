import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Providers from '../../../../common/enums/providers.enum';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService
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
        accessToken: string, _refreshToken: string, profile: Profile
    ) {
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
            console.error(err)
            throw new InternalServerErrorException()
        }
    }
}