import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserMutationsResolver } from './user.mutations.resolver';
import { UserQueriesResolver } from './user.queries.resolver';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: ['jwt', 'google'],
    }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    GoogleStrategy,
    UserMutationsResolver,
    UserQueriesResolver,
  ],
  exports: [PassportModule, JwtStrategy, UserService, GoogleStrategy],
})
export class UserModule {}