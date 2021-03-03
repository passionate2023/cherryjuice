import { EntityRepository, Repository } from 'typeorm/index';
import { SignUpCredentials } from '../dto/sign-up-credentials.dto';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInCredentials } from '../dto/sign-in-credentials.dto';
import { DeleteAccountDTO, OauthJson } from '../user.service';
import { UpdateUserProfileIt } from '../input-types/update-user-profile.it';
import { OauthSignUpCredentials } from '../dto/oauth-sign-up-credentials.dto';
import {
  EmailChangeTp,
  VerifyEmailTp,
} from '../interfaces/jwt-payload.interface';
import { removeDots } from '../pipes/gmail-dots';
import { UpdateUserSettingsIt } from '../input-types/update-user-settings.it';
import { Settings } from '../entities/settings/settings.entity';
import { Workspace } from '../entities/workspace/workspace.entity';

export type UserExistsDTO = { email: string };
export type CreatePasswordResetTokenDTO = { email: string; username: string };

export type UpdateUserProfileDTO = {
  input: UpdateUserProfileIt;
  userId: string;
  email: string;
};
export type UpdateUserSettingsDTO = {
  input: UpdateUserSettingsIt;
  userId: string;
};
export type OauthSignupDTO = {
  input: OauthSignUpCredentials;
  userId: string;
};

@EntityRepository(User)
class UserRepository extends Repository<User> {
  private async _getUser(emailOrUsername?: string, id?: string): Promise<User> {
    const user = id
      ? await this.findOne(id)
      : await this.findOne({
          where: [
            { username: emailOrUsername },
            {
              email: emailOrUsername,
            },
          ],
        });
    if (!user) throw new UnauthorizedException(`user not found`);
    return user;
  }
  async getUser(emailOrUsername?: string, id?: string): Promise<User> {
    return await this._getUser(emailOrUsername, id);
  }
  async findOneByThirdPartyId(
    thirdPartyId: string,
    thirdParty: string,
    email: string,
  ): Promise<User | undefined> {
    email = removeDots(email);
    const user = await this.findOne({
      where: [
        { email },
        { thirdPartyId },
        {
          thirdParty,
        },
      ],
    });
    return user;
  }

  async signUp({
    username,
    password,
    email,
    firstName,
    lastName,
  }: SignUpCredentials): Promise<User> {
    const user = new User({ username, email, lastName, firstName });
    await user.setPassword(password);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username or email exists');
      } else {
        // eslint-disable-next-line no-console
        console.log(e);
        throw new InternalServerErrorException('Database error');
      }
    }

    return user;
  }
  async validateUserPassword({
    password,
    emailOrUsername,
  }: SignInCredentials): Promise<User> {
    const user = await this._getUser(emailOrUsername);
    if (!user) throw new UnauthorizedException();
    if (user.thirdParty && !user.hasPassword)
      throw new UnauthorizedException(`Please use ${user.thirdParty} to login`);

    await user.validatePassword(password);
    return user;
  }

  async registerOAuthUser(
    thirdPartyId: string,
    provider: string,
    {
      sub,
      email,
      picture,
      given_name: firstName,
      family_name: lastName,
      email_verified,
    }: OauthJson,
  ): Promise<User> {
    email = removeDots(email);
    const username = /(^.*)@/.exec(email)[1];
    const user = new User({
      username,
      email,
      lastName,
      firstName,
      thirdPartyId: sub,
      thirdParty: provider,
      email_verified,
      picture,
    });

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(e.detail);
      } else {
        // eslint-disable-next-line no-console
        console.log(e);
        throw new InternalServerErrorException('Database error');
      }
    }

    return user;
  }

  private async updateUser(
    user: User,
    data:
      | { email_verified: boolean }
      | { email: string; email_verified: boolean }
      | Omit<UpdateUserProfileIt, 'newEmail'>
      | Omit<OauthSignUpCredentials, 'password'>
      | { settings: Settings }
      | { workspace: Workspace },
  ): Promise<void> {
    Object.entries(data).forEach(([key, value]) => {
      user[key] = value;
    });
    try {
      await this.save(user);
    } catch (e) {
      if (e.code === '23505') {
        if ('username' in data) throw new ConflictException('username exists');
      } else {
        // eslint-disable-next-line no-console
        console.log(e);
        throw new InternalServerErrorException('Database error');
      }
    }
  }

  async updateUserProfile({
    userId,
    input,
  }: UpdateUserProfileDTO): Promise<string> {
    const user = await this._getUser(undefined, userId);
    await user.validatePassword(input.currentPassword);
    if (input.newPassword) {
      await user.setPassword(input.newPassword);
      delete input.newPassword;
    }
    await this.updateUser(user, input);
    return user.id;
  }

  async updateUserSettings({
    userId,
    input,
  }: UpdateUserSettingsDTO): Promise<string> {
    const user = await this._getUser(undefined, userId);
    await this.updateUser(user, { settings: { ...user.settings, ...input } });
    return user.id;
  }

  async resetPassword({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }): Promise<void> {
    const user = await this._getUser(undefined, userId);
    await user.setPassword(password);
    await this.save(user);
  }

  async oauthSignUp({ input, userId }: OauthSignupDTO): Promise<User> {
    const user = await this._getUser(undefined, userId);
    if (user.hasPassword) throw new UnauthorizedException('user has password');
    await user.setPassword(input.password);
    delete input.password;
    await this.updateUser(user, input);
    return user;
  }

  async deleteAccount({
    userId,
    currentPassword,
  }: DeleteAccountDTO): Promise<string> {
    const user = await this._getUser(undefined, userId);
    await user.validatePassword(currentPassword);
    await this.remove(user);
    return userId;
  }

  async userExists(dto: UserExistsDTO): Promise<string | undefined> {
    return await this.findOne({
      where: dto,
    }).then(user => user?.id);
  }

  async verifyEmail({ userId }: VerifyEmailTp): Promise<void> {
    const user = await this._getUser(undefined, userId);
    await this.updateUser(user, { email_verified: true });
  }

  async changeEmail({
    userId,
    currentEmail,
    newEmail,
  }: EmailChangeTp): Promise<void> {
    const user = await this._getUser(undefined, userId);
    if (user.email !== currentEmail)
      throw new UnauthorizedException('invalid token');
    await this.updateUser(user, { email: newEmail, email_verified: false });
  }
}

export { UserRepository };
