import { Repository, EntityRepository } from 'typeorm';
import { SignUpCredentials } from '../dto/sign-up-credentials.dto';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInCredentials } from '../dto/sign-in-credentials.dto';
import { OauthJson } from '../user.service';
import { UpdateUserProfileIt } from '../input-types/update-user-profile.it';
import { classToClass } from 'class-transformer';

export type UserExistsDTO = { email: string };

export type UpdateUserProfileDTO = {
  input: UpdateUserProfileIt;
  username: string;
};

@EntityRepository(User)
class UserRepository extends Repository<User> {
  async _getUser(emailOrUsername?: string, id?: string): Promise<User> {
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
    const user = await this._getUser(emailOrUsername, id);
    return classToClass(user);
  }
  async findOneByThirdPartyId(
    thirdPartyId: string,
    thirdParty: string,
    email: string,
  ): Promise<User | undefined> {
    const user = await this.findOne({
      where: [
        { email },
        { thirdPartyId },
        {
          thirdParty,
        },
      ],
    });
    return classToClass(user);
  }

  async userExists({ email }: UserExistsDTO): Promise<string | undefined> {
    return await this.findOne({ where: { email } }).then(user => user?.id);
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

    return classToClass(user);
  }
  async validateUserPassword({
    password,
    emailOrUsername,
  }: SignInCredentials): Promise<User> {
    const user = await this._getUser(emailOrUsername);
    if (!user) throw new UnauthorizedException();
    if (user.thirdParty)
      throw new UnauthorizedException(`Please use ${user.thirdParty} to login`);

    await user.validatePassword(password);
    return classToClass(user);
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

    return classToClass(user);
  }

  private async updateUser(
    user: User,
    data: UpdateUserProfileIt,
  ): Promise<void> {
    Object.entries(data).forEach(([key, value]) => {
      user[key] = value;
    });
    try {
      await this.save(user);
    } catch (e) {
      if (e.code === '23505') {
        if (data.username) throw new ConflictException('username exists');
      } else {
        // eslint-disable-next-line no-console
        console.log(e);
        throw new InternalServerErrorException('Database error');
      }
    }
  }

  async updateUserProfile({
    username,
    input,
  }: UpdateUserProfileDTO): Promise<string> {
    const user = await this._getUser(username);
    await user.validatePassword(input.currentPassword);
    if (input.newPassword) {
      await user.setPassword(input.newPassword);
      delete input.newPassword;
    }
    await this.updateUser(user, input);
    return user.id;
  }
}

export { UserRepository };
