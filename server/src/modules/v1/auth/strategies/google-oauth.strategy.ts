import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'modules/v1/user/user.service';

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
        accessToken: string, refreshToken: string, profile: any, done: VerifyCallback
    ): Promise<any> {
        const { id, name, emails } = profile

        const user = {
            provider: 'google',
            providerId: id,
            name: name.givenName,
            username: emails[0].value,
            accessToken
        }

        return user
    }
}