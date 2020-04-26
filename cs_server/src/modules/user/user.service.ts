import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { sign } from 'jsonwebtoken';
import { AuthUser } from './entities/auth.user';
import { User } from './entities/user.entity';

export enum Provider {
  GOOGLE = 'google',
}

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
    return { token: this.jwtService.sign(payload), user };
  }
  async signIn(authCredentialsDto: SignInCredentials): Promise<AuthUser> {
    const { user, payload } = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    return { token: this.jwtService.sign(payload), user };
  }

  async getAuthUser(user_: User): Promise<AuthUser> {
    const { user, payload } = await UserRepository.getAuthUser(user_);
    return { token: this.jwtService.sign(payload), user };
  }

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Provider,
  ): Promise<string> {
    try {
      // You can add some registration logic here,
      // to register the user using their thirdPartyId (in this case their googleId)
      // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

      // if (!user)
      // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);

      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}
