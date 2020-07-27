import { EditDocumentIt } from '../input-types/edit-document.it';
import { Document } from '../entities/document.entity';
import { CreateDocumentIt } from '../input-types/create-document.it';

export type GetDocumentDTO = {
  userId: string;
  documentId: string;
};
export type GetDocumentsDTO = Omit<GetDocumentDTO, 'documentId'>;
export type EditDocumentDTO = {
  getDocumentDTO: GetDocumentDTO;
  meta: EditDocumentIt;
  updater?: (document: Document) => Document;
};

export type CreateDocumentDTO = {
  data: CreateDocumentIt;
  userId: string;
};
