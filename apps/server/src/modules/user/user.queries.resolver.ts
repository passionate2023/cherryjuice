import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthUser } from './entities/auth.user';
import { UserQuery } from './entities/user.mutation.entity';
import { GetUserGql } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/graphql.guard';
import { Timestamp } from '../document/helpers/graphql-types/timestamp';
import { UserToken } from './entities/user-token.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @ResolveField(() => [UserToken], { nullable: 'items' })
  async tokens(@Parent() user: User): Promise<UserToken[]> {
    return await this.userService.getTokens(user.id);
  }
}

@UseGuards(GqlAuthGuard)
@Resolver(() => UserQuery)
export class UserQueriesResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserQuery)
  async user(): Promise<Partial<User>> {
    return {};
  }

  @ResolveField(() => AuthUser)
  async refreshToken(@GetUserGql() user: User): Promise<AuthUser> {
    return this.userService.refreshUser(user.id);
  }

  @ResolveField(() => String, { nullable: true })
  async userExists(
    @GetUserGql({ nullable: false }) user: User,
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<string | undefined> {
    return this.userService.userExists({ email });
  }

  @ResolveField(() => Timestamp)
  async verifyTokenValidity(
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<number> {
    await this.userService.verifyTokenValidity(token);
    return Date.now();
  }
}
