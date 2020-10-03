import { Document } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';

export interface IDocumentRepository {
  getDocumentsMeta(user: User): Promise<Document[]>;

  getDocumentById(user: User, file_id: string): Promise<Document>;
}
