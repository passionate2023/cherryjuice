import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthUser } from './entities/auth.user';
import { UserMutation } from './entities/user.mutation.entity';
import { SignUpCredentials } from './dto/sign-up-credentials.dto';
import { SignInCredentials } from './dto/sign-in-credentials.dto';
import { UpdateUserProfileIt } from './input-types/update-user-profile.it';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GetUserGql } from './decorators/get-user.decorator';
import { GqlAuthGuard } from './guards/graphql.guard';
import { OauthSignUpCredentials } from './dto/oauth-sign-up-credentials.dto';
import { ResetPasswordIt } from './input-types/reset-password.it';
import { Timestamp } from '../document/helpers/graphql-types/timestamp';
import { VerifyEmailIt } from './input-types/verify-email.it';
import { ConfirmEmailChangeIt } from './input-types/confirm-email-change.it';
import {
  CancelChangeEmailIt,
  ChangeEmailIt,
} from './input-types/change-email.it';
import { RemoveGmailDots } from './pipes/gmail-dots';
import { UpdateUserSettingsIt } from './input-types/update-user-settings.it';
import { EmailAlreadyVerifiedException } from './exceptions/email-already-verified.exception';
import { EmailNotVerifiedException } from './exceptions/email-not-verified.exception';
@UseGuards(GqlAuthGuard)
@Resolver(() => UserMutation)
export class UserMutationsResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => UserMutation)
  async user(): Promise<Partial<User>> {
    return {};
  }

  @ResolveField(() => AuthUser)
  async signIn(
    @Args(
      { name: 'credentials', type: () => SignInCredentials },
      RemoveGmailDots,
    )
    signInInput: SignInCredentials,
  ): Promise<AuthUser> {
    return this.userService.signIn(signInInput);
  }

  @ResolveField(() => AuthUser)
  async signUp(
    @Args(
      { name: 'credentials', type: () => SignUpCredentials },
      RemoveGmailDots,
    )
    signInInput: SignUpCredentials,
  ): Promise<AuthUser> {
    return this.userService.signUp(signInInput);
  }

  @ResolveField(() => AuthUser)
  async oauthSignUp(
    @GetUserGql() user: User,
    @Args({ name: 'credentials', type: () => OauthSignUpCredentials })
    input: OauthSignUpCredentials,
  ): Promise<AuthUser> {
    return this.userService.oauthSignUp({ userId: user.id, input });
  }

  @ResolveField(() => AuthUser)
  async updateUserProfile(
    @GetUserGql({ nullable: false }) user: User,
    @Args(
      { name: 'userProfile', type: () => UpdateUserProfileIt },
      RemoveGmailDots,
    )
    input: UpdateUserProfileIt,
  ): Promise<AuthUser> {
    await this.userService.updateUserProfile({
      input,
      userId: user.id,
      email: user.email,
    });
    return this.userService.refreshUser(user.id);
  }

  @ResolveField(() => AuthUser)
  async updateUserSettings(
    @GetUserGql({ nullable: false }) user: User,
    @Args(
      { name: 'userSettings', type: () => UpdateUserSettingsIt },
      RemoveGmailDots,
    )
    input: UpdateUserSettingsIt,
  ): Promise<AuthUser> {
    await this.userService.updateUserSettings({
      input,
      userId: user.id,
    });
    return this.userService.refreshUser(user.id);
  }

  @ResolveField(() => String)
  async deleteAccount(
    @GetUserGql() user: User,
    @Args({ name: 'currentPassword', type: () => String })
    currentPassword: string,
  ): Promise<string> {
    return this.userService.deleteAccount({ userId: user.id, currentPassword });
  }

  @ResolveField(() => Timestamp)
  async createPasswordResetToken(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'username', type: () => String })
    username: string,
  ): Promise<number> {
    await this.userService.createPasswordResetToken({
      email,
      username,
    });
    return Date.now();
  }

  @ResolveField(() => Timestamp)
  async resetPassword(
    @Args({ name: 'input', type: () => ResetPasswordIt })
    input: ResetPasswordIt,
  ): Promise<number> {
    await this.userService.resetPassword({
      input,
    });
    return Date.now();
  }

  @ResolveField(() => Timestamp)
  async createEmailVerificationToken(
    @GetUserGql({ nullable: false }) user: User,
  ): Promise<number> {
    if (user.email_verified) throw new EmailAlreadyVerifiedException();
    await this.userService.createEmailVerificationToken({
      userId: user.id,
      email: user.email,
    });
    return Date.now();
  }

  @ResolveField(() => Timestamp)
  async cancelEmailChangeToken(
    @GetUserGql({ nullable: false }) user: User,
    @Args({ name: 'input', type: () => CancelChangeEmailIt })
    input: CancelChangeEmailIt,
  ): Promise<number> {
    if (!user.email_verified) throw new EmailNotVerifiedException();
    await this.userService.cancelEmailChangeToken({
      userId: user.id,
      id: input.tokenId,
    });
    return Date.now();
  }

  @ResolveField(() => Timestamp)
  async createEmailChangeToken(
    @GetUserGql({ nullable: false }) user: User,
    @Args({ name: 'input', type: () => ChangeEmailIt }, RemoveGmailDots)
    input: ChangeEmailIt,
  ): Promise<number> {
    if (!user.email_verified) throw new EmailNotVerifiedException();
    await this.userService.createEmailChangeToken({
      userId: user.id,
      currentEmail: user.email,
      newEmail: input.email,
    });
    return Date.now();
  }

  @ResolveField(() => Timestamp)
  async verifyEmail(
    @Args({ name: 'input', type: () => VerifyEmailIt })
    input: VerifyEmailIt,
  ): Promise<number> {
    await this.userService.verifyEmail({
      input,
    });
    return Date.now();
  }

  @ResolveField(() => Timestamp)
  async changeEmail(
    @Args({ name: 'input', type: () => ConfirmEmailChangeIt })
    input: ConfirmEmailChangeIt,
  ): Promise<number> {
    await this.userService.changeEmail({
      input,
    });
    return Date.now();
  }
}
