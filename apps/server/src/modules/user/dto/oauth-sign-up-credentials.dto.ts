import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { patterns } from './sign-up-credentials.dto';

@InputType()
export class OauthSignUpCredentials {
  @Field()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(patterns.username.pattern, {
    message: patterns.username.description,
  })
  username: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(patterns.password.pattern, {
    message: patterns.password.description,
  })
  password: string;
}
