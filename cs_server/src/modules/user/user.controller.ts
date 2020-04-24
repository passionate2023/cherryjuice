import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { UserService } from './user.service';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

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


  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect(process.env.OAUTH_REDIRECT_URL + jwt);
    else res.redirect(process.env.OAUTH_REDIRECT_URL);
  }
}
