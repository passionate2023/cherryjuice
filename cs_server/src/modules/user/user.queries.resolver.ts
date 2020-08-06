import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthUser } from './entities/auth.user';
import { UserQuery } from './entities/user.mutation.entity';
import { GetUserGql } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/graphql.guard';
import { Timestamp } from '../document/helpers/graphql-types/timestamp';

@UseGuards(GqlAuthGuard)
@Resolver(() => UserQuery)
export class UserQueriesResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserQuery)
  async user(): Promise<{}> {
    return {};
  }

  @ResolveField(() => AuthUser)
  async refreshToken(@GetUserGql() user: User): Promise<AuthUser> {
    return this.userService.refreshUser(user.id);
  }

  @ResolveField(() => String, { nullable: true })
  async userExists(
    @GetUserGql() user: User,
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<string | undefined> {
    if (!user) throw new UnauthorizedException();
    return this.userService.userExists({ email });
  }

  @ResolveField(() => Timestamp)
  async verifyToken(
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<number> {
    await this.userService.verifyToken(token);
    return Date.now();
  }
}
