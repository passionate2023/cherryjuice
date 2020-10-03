import { EntityRepository, Repository } from 'typeorm';
import { AccessLevel, DocumentGuest } from '../entities/document-guest.entity';
import { DocumentGuestIt } from '@cs/graphql-types';

export type AddGuestDTO = {
  userId: string;
  documentId: string;
  accessLevel: AccessLevel;
  email: string;
};

@EntityRepository(DocumentGuest)
export class DocumentGuestRepository extends Repository<DocumentGuest> {
  addGuest = async (dto: AddGuestDTO): Promise<DocumentGuest> => {
    const documentGuest = new DocumentGuest(dto);
    await documentGuest.save();
    return documentGuest;
  };

  removeGuest = async ({ userId, documentId }: AddGuestDTO): Promise<void> => {
    await this.delete({ userId, documentId });
  };
  async setGuests({
    guests,
    documentId,
  }: {
    guests: DocumentGuestIt[];
    documentId: string;
  }): Promise<void> {
    const existingGuests = Object.fromEntries(
      (
        await this.find({
          where: {
            documentId,
          },
        })
      ).map(guest => [guest.userId, guest]),
    );
    for await (const guest of guests) {
      if (existingGuests[guest.userId]) {
        existingGuests[guest.userId].accessLevel = guest.accessLevel;
        await this.save(existingGuests[guest.userId]);
      } else await this.addGuest({ ...guest, documentId });
      delete existingGuests[guest.userId];
    }
    for await (const guest of Object.values(existingGuests)) {
      await this.removeGuest(guest);
    }
  }
}
