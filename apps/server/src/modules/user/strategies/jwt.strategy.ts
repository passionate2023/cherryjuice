import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConfig } from '../../../config/jwt.config';
import { AuthenticatedUserTp } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

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
    if (!user) throw new UserNotFoundException(payload.id);

    return user;
  }
}
