import { EntityRepository, Repository } from 'typeorm';
import { DocumentGuest, AccessLevel } from '../entities/document-guest.entity';

export type AddGuestDTO = {
  userId: string;
  documentId: string;
  accessLevel: AccessLevel;
};

@EntityRepository(DocumentGuest)
export class DocumentGuestRepository extends Repository<DocumentGuest> {
  addGuest = async ({
    userId,
    documentId,
    accessLevel,
  }: AddGuestDTO): Promise<DocumentGuest> => {
    const documentGuest = new DocumentGuest(userId, documentId, accessLevel);
    await documentGuest.save();
    return documentGuest;
  };
}
