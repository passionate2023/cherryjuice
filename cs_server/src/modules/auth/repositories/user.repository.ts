import { Repository, EntityRepository } from 'typeorm';
import { SignUpCredentialsDto } from '../dto/sign-up-credentials.dto';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from '../dto/sign-in-credentials.dto';

const hashPassword = (password: string, salt: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};

@EntityRepository(User)
class UserRepository extends Repository<User> {
  async signUp({
    username,
    password,
    email,
    firstName,
    lastName,
  }: SignUpCredentialsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const user = new User(username, email, lastName, firstName);
    user.salt = salt;
    user.password = await hashPassword(password, salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Username ${username} exists`);
      } else {
        throw new InternalServerErrorException('database error');
      }
    }
  }

  async validateUserPassword({
    password,
    emailOrUsername,
  }: SignInCredentialsDto): Promise<JwtPayloadInterface> {
    let hash: string;
    const user = await this.findOne({
      where: [
        { username: emailOrUsername },
        {
          email: emailOrUsername,
        },
      ],
    });
    if (user) {
      hash = await hashPassword(password, user.salt);
    }
    if (!(hash && hash === user.password)) {
      throw new UnauthorizedException('invalid credentials');
    }
    return { username: user.username };
  }
}

export { UserRepository };
