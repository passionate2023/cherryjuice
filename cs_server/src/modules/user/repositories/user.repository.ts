import { Repository, EntityRepository } from 'typeorm';
import { SignUpCredentials } from '../dto/sign-up-credentials.dto';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { SignInCredentials } from '../dto/sign-in-credentials.dto';
import { OauthJson } from '../user.service';

const hashPassword = (password: string, salt: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};
const pickNonSensitiveFields = (user: User): User => {
  let _user = new User(
    user.username,
    user.email,
    user.lastName,
    user.firstName,
  );
  _user.id = user.id;
  _user.picture = user.picture;
  return _user;
};

@EntityRepository(User)
class UserRepository extends Repository<User> {
  static getAuthUser = (
    user: User,
  ): {
    user: User;
    payload: JwtPayloadInterface;
  } => {
    return {
      payload: { username: user.username },
      user: pickNonSensitiveFields(user),
    };
  };
  async signUp({
    username,
    password,
    email,
    firstName,
    lastName,
  }: SignUpCredentials): Promise<{
    user: User;
    payload: JwtPayloadInterface;
  }> {
    const salt = await bcrypt.genSalt();
    const user = new User(username, email, lastName, firstName);
    user.salt = salt;
    user.password = await hashPassword(password, salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username or email exists');
      } else {
        throw new InternalServerErrorException('Database error');
      }
    }

    return UserRepository.getAuthUser(user);
  }

  async validateUserPassword({
    password,
    emailOrUsername,
  }: SignInCredentials): Promise<{
    user: User;
    payload: JwtPayloadInterface;
  }> {
    let hash: string;
    const user = await this.getUser({ emailOrUsername });
    if (user) {
      if (!user.salt && user.thirdParty) {
        throw new UnauthorizedException(
          `Please use ${user.thirdParty} to login`,
        );
      }
      hash = await hashPassword(password, user.salt);
    }
    if (!(hash && hash === user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return UserRepository.getAuthUser(user);
  }

  async getUser({
    emailOrUsername,
  }: {
    emailOrUsername: string;
  }): Promise<User> {
    const user = await this.findOne({
      where: [
        { username: emailOrUsername },
        {
          email: emailOrUsername,
        },
      ],
    });
    if (!user) throw new InternalServerErrorException('Invalid credentials');
    return user;
  }

  async findOneByThirdPartyId(
    thirdPartyId: string,
    thirdParty: string,
  ): Promise<User | undefined> {
    return await this.findOne({
      where: [
        { thirdPartyId },
        {
          thirdParty,
        },
      ],
    });
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
  ): Promise<{ user: User; payload: JwtPayloadInterface }> {
    const userName = /(^.*)@/.exec(email)[1];
    const user = new User(userName, email, lastName, firstName);
    user.salt = '';
    user.password = '';
    user.thirdPartyId = sub;
    user.thirdParty = provider;
    user.email_verified = email_verified;
    user.picture = picture;

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException('Database error');
      }
    }

    return UserRepository.getAuthUser(user);
  }
}

export { UserRepository };
