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
import { AuthUser } from './entities/auth.user';

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
    const authUser: AuthUser = req.user.authUser;
    if (authUser) {
      return `<html><body><script>window.opener.postMessage(${JSON.stringify({
        authUser,
      })},${
        process.env.NODE_ENV === 'development' ? '*' : '/'
      });window.close()</script></body></html>`;
    } else {
      return 'There was a problem signing in...';
    }
  }
}
