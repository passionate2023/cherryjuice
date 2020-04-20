import { Document } from '../entities/document.entity';
import { User } from '../../auth/entities/user.entity';

export interface IDocumentRepository {
  getDocumentsMeta(user: User): Promise<Document[]>;

  getDocumentMetaById(user: User, file_id: string): Promise<Document>;
}
