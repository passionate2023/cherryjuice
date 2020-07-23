import { EntityRepository, Repository } from 'typeorm';
import {
  DocumentOwner,
  OwnershipLevel,
} from '../entities/document.owner.entity';
import { User } from '../../user/entities/user.entity';
import { Document } from '../entities/document.entity';
import { EditDocumentDTO } from './document.repository';
import { UnauthorizedException } from '@nestjs/common';

export type CreateDocumentOwnershipDTO = {
  user: User;
  document: Document;
  ownershipLevel: OwnershipLevel;
};

@EntityRepository(DocumentOwner)
export class DocumentOwnerRepository extends Repository<DocumentOwner> {
  createOwnership = async ({
    user,
    document,
    ownershipLevel,
  }: CreateDocumentOwnershipDTO): Promise<DocumentOwner> => {
    const documentOwner = new DocumentOwner(user, document, ownershipLevel);
    await documentOwner.save();
    return documentOwner;
  };

  async updateOwnership({
    getDocumentDTO: { documentId, userId },
    meta,
  }: EditDocumentDTO): Promise<void> {
    const ownership = await this.findOneOrFail({
      userId,
      documentId,
    });
    if (ownership.ownershipLevel !== OwnershipLevel.OWNER)
      throw new UnauthorizedException();

    ownership.public = meta.owner.public;
    await this.save(ownership);
  }
}
