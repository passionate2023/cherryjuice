import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

export const patterns = {
  password: {
    pattern: /^((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    description: `password: at least 1 upper case letter, at least 1 lower case letter, at least 1 number or special character`,
  },
  username: {
    pattern: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    description:
      'username: only a-zA-Z0-9._ allowed, no _ or . at teh beginning, no __ or _. or ._ or .. inside,  no _ or . at the end',
  },
  firstName: {
    pattern: /^([a-zA-Z'\-,.]|[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]){2,}$/,
    description: 'first-name: letters only',
  },
  lastName: {
    pattern: /^([a-zA-Z'\-,.]|[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]){2,}$/,
    description: 'last-name: letters only',
  },
};

@InputType()
export class SignUpCredentials {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(patterns.firstName.pattern, {
    message: patterns.firstName.description,
  })
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(patterns.lastName.pattern, {
    message: patterns.lastName.description,
  })
  lastName: string;

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

  @Field()
  @IsEmail()
  email: string;
}
