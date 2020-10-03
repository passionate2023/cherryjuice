import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConfig } from '../../../config/jwt.config';
import { AuthenticatedUserTp } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: AuthenticatedUserTp): Promise<User> {
    const { id } = payload;
    const user = await this.userService.getUserById(id);
    if (!user) throw new UnauthorizedException('user does not exist');

    return user;
  }
}
