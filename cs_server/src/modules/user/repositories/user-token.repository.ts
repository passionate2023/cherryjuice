import { EntityRepository, Repository } from 'typeorm/index';
import {
  UserToken,
  UserTokenMeta,
  UserTokenType,
} from '../entities/user-token.entity';
import { PasswordResetTp } from '../interfaces/jwt-payload.interface';
import { NotFoundException } from '@nestjs/common';

type CreateTokenDTO = {
  userId: string;
  type: UserTokenType;
  meta?: UserTokenMeta;
};

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {
  private async _getToken({ id, userId }: PasswordResetTp): Promise<UserToken> {
    const token = await this.findOne({ where: { id, userId } });
    if (!token) throw new NotFoundException('invalid token');
    return token;
  }

  async createToken({
    userId,
    type,
    meta,
  }: CreateTokenDTO): Promise<UserToken> {
    const existingToken = await this.findOne({ where: { userId, type } });
    if (existingToken) await this.remove(existingToken);
    const token = new UserToken({
      userId,
      type,
      meta,
    });
    await this.save(token);
    return token;
  }

  async verifyToken(dto: PasswordResetTp): Promise<void> {
    await this._getToken(dto);
  }

  async deleteToken(dto: PasswordResetTp): Promise<void> {
    const token = await this._getToken(dto);
    await this.remove(token);
  }

  async deleteExpiredTokens(): Promise<void> {
    throw new Error('not implemented');
  }
}
