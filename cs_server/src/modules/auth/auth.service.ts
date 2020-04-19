import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';

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
}
