import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from '../user.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: UserService) {
    super({
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID || '_',
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || '_',
      callbackURL:
        process.env.SERVER_URL + process.env.OAUTH_CALLBACK_PATH || '_',
      passReqToCallback: true,
      prompt: 'select_account',
      scope: ['profile', 'email', 'openid'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: Function,
  ): Promise<void> {
    try {
      const authUser = await this.authService.oauthLogin(
        profile.id,
        profile.provider,
        profile._json,
      );
      if (authUser) {
        done(null, {
          authUser,
        });
      } else done(undefined, false);
    } catch (err) {
      done(err, false);
    }
  }
}
