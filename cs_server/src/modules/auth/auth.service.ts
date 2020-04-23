import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { sign } from 'jsonwebtoken';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }
  async signIn(authCredentialsDto: SignInCredentialsDto): Promise<string> {
    const payload: JwtPayloadInterface = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    return this.jwtService.sign(payload);
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
