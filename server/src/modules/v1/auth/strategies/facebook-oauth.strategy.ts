import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Providers } from '../../../../common/enums';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('OAUTH_FACEBOOK_ID'),
            clientSecret: configService.get<string>('OAUTH_FACEBOOK_SECRET'),
            callbackURL: configService.get<string>('OAUTH_FACEBOOK_REDIRECT_URL'),
            scope: 'email',
            profileFields: ['id', 'emails', 'gender', 'name', 'displayName', 'picture.type(large)']
        });
    }

    async validate(
        _accessToken: string, _refreshToken: string, profile: Profile
    ) {
        try {
            const user = {
                provider: Providers.Facebook,
                providerId: profile.id,
                email: profile.emails[0].value,
                password: 'provided',
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                displayName: profile.displayName ?? profile.name.givenName,
                image: profile.photos[0].value,
            }
            
            return user
        } catch (err) {
            console.error(err)
            throw new InternalServerErrorException()
        }
    }
}