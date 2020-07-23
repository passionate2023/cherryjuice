import { EntityRepository, Repository } from 'typeorm';
import {
  DocumentOwner,
  OwnershipLevel,
} from '../entities/document.owner.entity';
import { EditDocumentDTO } from './document.repository';
import { UnauthorizedException } from '@nestjs/common';

export type CreateDocumentOwnershipDTO = {
  userId: string;
  documentId: string;
  ownershipLevel: OwnershipLevel;
  isPublic: boolean;
};

@EntityRepository(DocumentOwner)
export class DocumentOwnerRepository extends Repository<DocumentOwner> {
  createOwnership = async ({
    userId,
    documentId,
    ownershipLevel,
    isPublic,
  }: CreateDocumentOwnershipDTO): Promise<DocumentOwner> => {
    const documentOwner = new DocumentOwner(
      userId,
      documentId,
      ownershipLevel,
      isPublic,
    );
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
