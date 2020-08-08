import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePasswordResetTokenDTO,
  OauthSignupDTO,
  UpdateUserProfileDTO,
  UserExistsDTO,
  UserRepository,
} from './repositories/user.repository';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { AuthUser } from './entities/auth.user';
import { User } from './entities/user.entity';
import {
  AuthenticatedUserTp,
  PasswordResetTp,
  VerifyEmailTp,
} from './interfaces/jwt-payload.interface';
import { Secrets } from './entities/secrets';
import { UserTokenRepository } from './repositories/user-token.repository';
import { UserToken, UserTokenType } from './entities/user-token.entity';
import { ResetPasswordIt } from './input-types/reset-password.it';
import { VerifyEmailIt } from './input-types/verify-email.it';
import { EmailService } from '../email/email.service';

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
export type DeleteAccountDTO = { userId: string; currentPassword: string };

export const createJWTPayload = {
  authn: (user: User): AuthenticatedUserTp => ({
    id: user.id,
  }),
  passwordReset: (user: User, token: UserToken): PasswordResetTp => ({
    id: token.id,
    userId: user.id,
    type: token.type,
  }),
};

export type ResetPasswordDTO = {
  input: ResetPasswordIt;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(UserTokenRepository)
    private userTokenRepository: UserTokenRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private packageAuthUser(user: User): AuthUser {
    return {
      token: this.jwtService.sign(createJWTPayload.authn(user)),
      user,
      secrets: this.getSecrets(),
    };
  }

  async signUp(authCredentialsDto: SignUpCredentials): Promise<AuthUser> {
    const user = await this.userRepository.signUp(authCredentialsDto);
    return this.packageAuthUser(user);
  }

  async oauthSignUp(dto: OauthSignupDTO): Promise<AuthUser> {
    const user = await this.userRepository.oauthSignUp(dto);
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
        return existingUser;
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

  async deleteAccount(dto: DeleteAccountDTO): Promise<string> {
    return this.userRepository.deleteAccount(dto);
  }

  async createPasswordResetToken(
    dto: CreatePasswordResetTokenDTO,
  ): Promise<void> {
    const { email, username } = dto;
    const user = await this.userRepository.getUser(email);
    if (user.username !== username) {
      throw new UnauthorizedException(`user not found`);
    }
    const userToken = await this.userTokenRepository.createToken({
      userId: user.id,
      type: UserTokenType.PASSWORD_RESET,
    });
    const token = this.jwtService.sign(
      createJWTPayload.passwordReset(user, userToken),
      { expiresIn: '6h' },
    );

    await this.emailService.sendPasswordReset({ token, email: user.email });
  }

  async createEmailVerificationToken(user: User): Promise<void> {
    const userToken = await this.userTokenRepository.createToken({
      userId: user.id,
      type: UserTokenType.EMAIL_VERIFICATION,
    });
    const token = this.jwtService.sign(
      createJWTPayload.passwordReset(user, userToken),
      { expiresIn: '48h' },
    );

    await this.emailService.sendEmailVerification({ token, email: user.email });
  }

  async resetPassword({
    input: { newPassword, token },
  }: ResetPasswordDTO): Promise<void> {
    const tokenPayload: PasswordResetTp = this.jwtService.verify(token);
    await this.userTokenRepository.verifyToken(tokenPayload);
    await this.userRepository.resetPassword({
      userId: tokenPayload.userId,
      password: newPassword,
    });
    await this.userTokenRepository.deleteToken(tokenPayload);
  }

  async verifyTokenValidity(token: string): Promise<void> {
    const tokenPayload: PasswordResetTp = this.jwtService.verify(token);
    await this.userTokenRepository.verifyToken(tokenPayload);
  }

  verifyJwtToken(token: string): VerifyEmailTp {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('invalid token');
    }
  }

  async verifyEmail({
    input: { token },
  }: {
    input: VerifyEmailIt;
  }): Promise<void> {
    const tokenPayload: VerifyEmailTp = this.verifyJwtToken(token);
    await this.userTokenRepository.verifyToken(tokenPayload);
    await this.userRepository.verifyEmail(tokenPayload);
    await this.userTokenRepository.deleteToken(tokenPayload);
  }
}
