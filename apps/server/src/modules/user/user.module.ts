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
import { UserQueriesResolver, UserResolver } from './user.queries.resolver';
import { UserTokenRepository } from './repositories/user-token.repository';
import { EmailModule } from '../email/email.module';
import { FoldersRepository } from './repositories/folders.repository';
import { UserMetaQueriesResolver } from './user-meta.queries.resolver';
import { UserMetaMutationsResolver } from './user-meta.mutations.resolver';
import { FoldersService } from './folders.service';

@Module({
  imports: [
    EmailModule,
    PassportModule.register({
      defaultStrategy: ['jwt', 'google'],
    }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserTokenRepository,
      FoldersRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    GoogleStrategy,
    UserMutationsResolver,
    UserQueriesResolver,
    UserMetaQueriesResolver,
    UserMetaMutationsResolver,
    FoldersService,
    UserResolver,
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    UserService,
    GoogleStrategy,
    FoldersService,
  ],
})
export class UserModule {}
