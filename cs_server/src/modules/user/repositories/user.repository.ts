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

const hashPassword = (password: string, salt: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};

@EntityRepository(User)
class UserRepository extends Repository<User> {
  private static deleteSensitiveFields(user: User): User {
    let _user = new User(
      user.username,
      user.email,
      user.lastName,
      user.firstName,
    );
    _user.id = user.id;
    return _user;
  }

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
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException('database error');
      }
    }

    return {
      payload: { username: user.username },
      user: UserRepository.deleteSensitiveFields(user),
    };
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
      hash = await hashPassword(password, user.salt);
    }
    if (!(hash && hash === user.password)) {
      throw new UnauthorizedException('invalid credentials');
    }
    return {
      payload: { username: user.username },
      user: UserRepository.deleteSensitiveFields(user),
    };
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
    if (!user) throw new InternalServerErrorException();
    return user;
  }
}

export { UserRepository };
