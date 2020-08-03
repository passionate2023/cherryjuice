import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthUser } from './entities/auth.user';
import { UserMutation } from './entities/user.mutation.entity';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { UpdateUserProfileIt } from './input-types/update-user-profile.it';
import { User } from './entities/user.entity';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GetUserGql } from './decorators/get-user.decorator';
import { GqlAuthGuard } from './guards/graphql.guard';
@UseGuards(GqlAuthGuard)
@Resolver(() => UserMutation)
export class UserMutationsResolver {
  constructor(private userService: UserService) {}
  @Mutation(() => UserMutation)
  async user(): Promise<{}> {
    return {};
  }

  @ResolveField(() => AuthUser)
  async signIn(
    @Args({ name: 'credentials', type: () => SignInCredentials })
    signInInput: SignInCredentials,
  ): Promise<AuthUser> {
    return this.userService.signIn(signInInput);
  }
  @ResolveField(() => AuthUser)
  async signUp(
    @Args({ name: 'credentials', type: () => SignUpCredentials })
    signInInput: SignUpCredentials,
  ): Promise<AuthUser> {
    return this.userService.signUp(signInInput);
  }

  @ResolveField(() => String)
  async updateUserProfile(
    @GetUserGql() user: User,
    @Args({ name: 'userProfile', type: () => UpdateUserProfileIt })
    input: UpdateUserProfileIt,
  ): Promise<string> {
    if (!user) throw new UnauthorizedException();
    return this.userService.updateUserProfile({
      input,
      username: user.username,
    });
  }
}
