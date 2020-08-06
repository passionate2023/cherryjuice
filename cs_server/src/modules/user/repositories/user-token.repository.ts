import { EntityRepository, Repository } from 'typeorm/index';
import { UserToken, UserTokenType } from '../entities/user-token.entity';
import { PasswordResetPayloadToken } from '../interfaces/jwt-payload.interface';
import { NotFoundException } from '@nestjs/common';

type CreateTokenDTO = {
  userId: string;
  type: UserTokenType;
};

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {
  private async _getToken({
    id,
    userId,
  }: PasswordResetPayloadToken): Promise<UserToken> {
    const token = await this.findOne({ where: { id, userId } });
    if (!token) throw new NotFoundException('invalid token');
    return token;
  }

  async createToken({ userId, type }: CreateTokenDTO): Promise<UserToken> {
    const existingToken = await this.findOne({ where: { userId, type } });
    if (existingToken) await this.remove(existingToken);
    const token = new UserToken({
      userId,
      type,
    });
    await this.save(token);
    return token;
  }

  async verifyToken(dto: PasswordResetPayloadToken): Promise<void> {
    await this._getToken(dto);
  }

  async consumeToken(dto: PasswordResetPayloadToken): Promise<void> {
    const token = await this._getToken(dto);
    await this.remove(token);
  }

  async deleteExpiredTokens(): Promise<void> {
    throw new Error('not implemented');
  }
}
