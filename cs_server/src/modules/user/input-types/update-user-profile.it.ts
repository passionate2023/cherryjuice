import { Field, InputType } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { patterns } from '../dto/sign-up-credentials.dto';

@InputType('UpdateUserProfileIt')
export class UpdateUserProfileIt {
  @Field()
  currentPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  @Matches(patterns.firstName.pattern, {
    message: patterns.firstName.description,
  })
  @Field({ nullable: true })
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  @Matches(patterns.lastName.pattern, {
    message: patterns.lastName.description,
  })
  @Field({ nullable: true })
  lastName: string;

  @IsOptional()
  @IsString()
  @Matches(patterns.username.pattern, {
    message: patterns.username.description,
  })
  @MinLength(4)
  @MaxLength(20)
  @Field({ nullable: true })
  username: string;

  @IsOptional()
  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(patterns.password.pattern, {
    message: patterns.password.description,
  })
  @Field({ nullable: true })
  newPassword: string;
}
