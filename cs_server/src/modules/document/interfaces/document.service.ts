import { Document } from '../entities/document.entity';

export interface IDocumentService {
  getDocumentsMeta(): Promise<Document[]>;

  getDocumentMetaById(file_id: string): Promise<Document>;
}