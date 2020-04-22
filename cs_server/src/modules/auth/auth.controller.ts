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
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

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


  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect(process.env.OAUTH_REDIRECT_URL + jwt);
    else res.redirect(process.env.OAUTH_REDIRECT_URL);
  }
}
