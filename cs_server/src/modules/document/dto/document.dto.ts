import { EditDocumentIt } from '../input-types/edit-document.it';
import { Document, Privacy } from '../entities/document.entity';
import { AccessLevel } from '../entities/document-guest.entity';
import { CreateDocumentIt } from '../input-types/create-document.it';

export type GetDocumentDTO = {
  userId: string;
  documentId: string;
  minimumGuestAccessLevel: AccessLevel;
  minimumPrivacy: Privacy;
};
export type GetDocumentsDTO = Omit<
  GetDocumentDTO,
  'minimumPrivacy' | 'documentId'
>;
export type EditDocumentDTO = {
  getDocumentDTO: GetDocumentDTO;
  meta: EditDocumentIt;
  updater?: (document: Document) => Document;
};

export type CreateDocumentDTO = {
  data: CreateDocumentIt;
  userId: string;
};
