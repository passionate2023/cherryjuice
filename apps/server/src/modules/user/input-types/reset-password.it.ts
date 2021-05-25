import { Field, InputType } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { patterns } from '../dto/sign-up-credentials.dto';

@InputType('ResetPasswordIt')
export class ResetPasswordIt {
  @Field()
  token: string;

  @IsOptional()
  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(patterns.password.pattern, {
    message: patterns.password.description,
  })
  @Field()
  newPassword: string;
}
