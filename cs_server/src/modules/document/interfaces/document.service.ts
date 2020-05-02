import { Document } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';

export interface IDocumentService {
  getDocumentsMeta(user: User): Promise<Document[]>;

  getDocumentMetaById(user: User, file_id: string): Promise<Document>;
}
