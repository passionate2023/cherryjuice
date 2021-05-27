import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType('ChangeEmailIt')
export class ChangeEmailIt {
  @IsOptional()
  @IsEmail()
  @Field()
  email: string;
}

@InputType('CancelChangeEmailIt')
export class CancelChangeEmailIt {
  @Field()
  tokenId: string;
}
