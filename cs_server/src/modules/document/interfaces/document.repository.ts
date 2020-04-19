import { Document } from '../entities/document.entity';

export interface IDocumentRepository {
  getDocumentsMeta(): Promise<Document[]>;

  getDocumentMetaById(file_id: string): Promise<Document>;
}
