import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { UserService } from './user.service';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('auth')
export class UserController {
  constructor(private authService: UserService) {}
  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: SignUpCredentials) {
    await this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  async signIn(@Body() authCredentialsDto: SignInCredentials) {
    return await this.authService.signIn(authCredentialsDto);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {
    const token: string = req.user.token;
    const user: User = req.user.user;
    if (token) {
      return `<html><body><script>window.opener.postMessage(${JSON.stringify({
        token,
        user,
      })}, '/');window.close()</script></body></html>`;
    } else {
      return 'There was a problem signing in...';
    }
  }
}
