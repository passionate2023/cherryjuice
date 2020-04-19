import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: SignUpCredentialsDto) {
    await this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  async signIn(@Body() authCredentialsDto: SignInCredentialsDto) {
    return await this.authService.signIn(authCredentialsDto);
  }
}
