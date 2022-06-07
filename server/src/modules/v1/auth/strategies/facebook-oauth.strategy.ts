import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Providers from '../../../../common/enums/providers.enum';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        configService: ConfigService,
    ) {
        super({
        // Put config in `.env`
            clientID: configService.get<string>('OAUTH_FACEBOOK_ID'),
            clientSecret: configService.get<string>('OAUTH_FACEBOOK_SECRET'),
            callbackURL: configService.get<string>('OAUTH_FACEBOOK_REDIRECT_URL'),
            profileFields: ['id', 'email', 'gender', 'name']
        });
    }

    async validate(
        accessToken: string, _refreshToken: string, profile: Profile
    ) {
        try {
            const { id, name, emails } = profile
            
            const user = {
                provider: Providers.Facebook,
                providerId: id,
                email: emails[0].value,
                password: 'provided',
                firstName: name.givenName,
                lastName: name.familyName,
                displayName: profile.displayName ?? profile.name.givenName,
                accessToken
            }
            
            return user
        } catch (err) {
            console.error(err)
            throw new InternalServerErrorException()
        }
    }
}