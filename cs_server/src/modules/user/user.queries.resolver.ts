import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from './guards/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { GetUserGql } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { AuthUser } from './entities/auth.user';
import { UserService } from './user.service';
import { Secrets } from './entities/secrets';

@UseGuards(GqlAuthGuard)
@Resolver(() => AuthUser)
export class UserQueriesResolver {
  constructor(private userService: UserService) {}

  @Query(() => AuthUser)
  async user(@GetUserGql() user: User): Promise<AuthUser> {
    return this.userService.getAuthUser(user);
  }
  @Query(() => Secrets)
  secrets(): Secrets {
    return this.userService.getSecrets();
  }
}
