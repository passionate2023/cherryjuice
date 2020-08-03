import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { patterns } from '../dto/sign-up-credentials.dto';

@InputType('UpdateUserProfileIt')
export class UpdateUserProfileIt {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(patterns.firstName.pattern, {
    message: patterns.firstName.description,
  })
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(patterns.lastName.pattern, {
    message: patterns.lastName.description,
  })
  lastName: string;
}
