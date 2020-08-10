import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { SignInCredentials } from '../dto/sign-in-credentials.dto';
import { SignUpCredentials } from '../dto/sign-up-credentials.dto';
import { UpdateUserProfileIt } from '../input-types/update-user-profile.it';
import { ChangeEmailIt } from '../input-types/change-email.it';

export const removeDots = (email: string): string => {
  const res = /(.*)@gmail.com/.exec(email);
  if (res) {
    return res[1].replace(/\./g, '') + '@gmail.com';
  } else return email;
};

@Injectable()
export class RemoveGmailDots<
  T =
    | SignInCredentials
    | SignUpCredentials
    | UpdateUserProfileIt
    | ChangeEmailIt
> implements PipeTransform<T, T> {
  transform(value: T): T {
    if ('emailOrUsername' in value) {
      value['emailOrUsername'] = removeDots(value['emailOrUsername']);
    } else if ('email' in value) {
      value['email'] = removeDots(value['email']);
    } else throw new BadRequestException('unsupported DTO');

    return value;
  }
}
