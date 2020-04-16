import { IDocumentRepository } from '../interfaces/document.repository';
import { EntityRepository, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document>
  implements IDocumentRepository {
  async getDocumentMetaById(file_id: string): Promise<Document> {
    return this.findOne(file_id);
  }

  async getDocumentsMeta(): Promise<Document[]> {
    return this.find();
  }
}
