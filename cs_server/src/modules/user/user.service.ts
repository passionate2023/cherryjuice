import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExistsDTO, UserRepository } from './repositories/user.repository';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { AuthUser } from './entities/auth.user';
import { User } from './entities/user.entity';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { Secrets } from './entities/secrets';

export type OauthJson = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: SignUpCredentials): Promise<AuthUser> {
    const { user, payload } = await this.userRepository.signUp(
      authCredentialsDto,
    );
    return {
      token: this.jwtService.sign(payload),
      user,
      secrets: this.getSecrets(),
    };
  }
  async signIn(authCredentialsDto: SignInCredentials): Promise<AuthUser> {
    const { user, payload } = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    return {
      token: this.jwtService.sign(payload),
      user,
      secrets: this.getSecrets(),
    };
  }

  async getAuthUser(user_: User): Promise<AuthUser> {
    const { user, payload } = await UserRepository.getAuthUser(user_);
    return {
      token: this.jwtService.sign(payload),
      user,
      secrets: this.getSecrets(),
    };
  }
  getSecrets(): Secrets {
    return {
      google_api_key: process.env.OAUTH_GOOGLE_DEVELOPER_KEY,
      google_client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
    };
  }
  async oauthLogin(
    thirdPartyId: string,
    provider: string,
    _json: OauthJson,
  ): Promise<{ user: User; payload: JwtPayloadInterface }> {
    try {
      const existingUser = await this.userRepository.findOneByThirdPartyId(
        thirdPartyId,
        provider,
      );
      return !existingUser
        ? await this.userRepository.registerOAuthUser(
            thirdPartyId,
            provider,
            _json,
          )
        : await UserRepository.getAuthUser(existingUser);
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async userExists(dto: UserExistsDTO): Promise<string | undefined> {
    return this.userRepository.userExists(dto);
  }
}
