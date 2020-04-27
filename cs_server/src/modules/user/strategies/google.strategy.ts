import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from '../user.service';
import { sign } from 'jsonwebtoken';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: UserService) {
    super({
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URL,
      passReqToCallback: true,
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
      let token;
      const authUser = await this.authService.oauthLogin(
        profile.id,
        profile.provider,
        profile._json,
      );
      if (authUser.payload) {
        token = sign(authUser.payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        done(null, { token, user: authUser.user });
      } else done(undefined, false);
    } catch (err) {
      done(err, false);
    }
  }
}
