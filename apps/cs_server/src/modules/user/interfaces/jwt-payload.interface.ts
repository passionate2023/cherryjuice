import { UserTokenType } from '../entities/user-token.entity';

export interface AuthenticatedUserTp {
  id: string;
}
export interface PasswordResetTp {
  id: string;
  userId: string;
  type: UserTokenType;
}
export type VerifyEmailTp = PasswordResetTp;
export type EmailChangeTp = PasswordResetTp & {
  newEmail: string;
  currentEmail: string;
};
