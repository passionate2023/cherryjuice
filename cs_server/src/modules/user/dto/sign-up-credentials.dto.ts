import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

const regex = {
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
    pattern: /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
    description: 'first-name: only letters',
  },
  lastName: {
    pattern: /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
    description: 'last-name: only letters',
  },
};

@InputType()
export class SignUpCredentials {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(regex.firstName.pattern, { message: regex.firstName.description })
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(regex.lastName.pattern, { message: regex.lastName.description })
  lastName: string;

  @Field()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(regex.username.pattern, { message: regex.username.description })
  username: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(regex.password.pattern, { message: regex.password.description })
  password: string;

  @Field()
  @IsEmail()
  email: string;
}
