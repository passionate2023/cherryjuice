import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UpdateUserProfileDTO,
  UserExistsDTO,
  UserRepository,
} from './repositories/user.repository';
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

  static createJWTPayload(user: User): JwtPayloadInterface {
    return { id: user.id };
  }
  private packageAuthUser(user: User): AuthUser {
    return {
      token: this.jwtService.sign(UserService.createJWTPayload(user)),
      user,
      secrets: this.getSecrets(),
    };
  }

  async signUp(authCredentialsDto: SignUpCredentials): Promise<AuthUser> {
    const user = await this.userRepository.signUp(authCredentialsDto);
    return this.packageAuthUser(user);
  }
  async signIn(authCredentialsDto: SignInCredentials): Promise<AuthUser> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    return this.packageAuthUser(user);
  }

  async getUserById(userId: string): Promise<User> {
    return await this.userRepository.getUser(undefined, userId);
  }

  async refreshUser(userId: string): Promise<AuthUser> {
    const user = await this.getUserById(userId);
    return this.packageAuthUser(user);
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
  ): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneByThirdPartyId(
        thirdPartyId,
        provider,
        _json.email,
      );
      if (existingUser) {
        return await this.userRepository.getUser(existingUser.email);
      } else {
        return await this.userRepository.registerOAuthUser(
          thirdPartyId,
          provider,
          _json,
        );
      }
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async userExists(dto: UserExistsDTO): Promise<string | undefined> {
    return this.userRepository.userExists(dto);
  }

  async updateUserProfile(dto: UpdateUserProfileDTO): Promise<string> {
    return this.userRepository.updateUserProfile(dto);
  }
}
