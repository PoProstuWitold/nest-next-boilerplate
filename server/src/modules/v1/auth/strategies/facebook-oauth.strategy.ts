import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyFunction } from 'passport-facebook';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../../modules/v1/user/user.service';
import Providers from '../types/providers.enum';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService
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
        accessToken: string, refreshToken: string, profile: Profile, done: any
    ): Promise<any> {
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
            console.log(err)
            throw new InternalServerErrorException()
        }
    }
}