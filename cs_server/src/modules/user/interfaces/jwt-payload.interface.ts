import { UserTokenType } from '../entities/user-token.entity';

export interface AuthnPayloadToken {
  id: string;
}
export interface PasswordResetPayloadToken {
  id: string;
  userId: string;
  type: UserTokenType;
}
