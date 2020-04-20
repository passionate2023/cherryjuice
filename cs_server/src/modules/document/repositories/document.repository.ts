import { IDocumentRepository } from '../interfaces/document.repository';
import { EntityRepository, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import fs from 'fs';
import { User } from '../../auth/entities/user.entity';

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document>
  implements IDocumentRepository {
  async getDocumentMetaById(user: User, file_id: string): Promise<Document> {
    return this.findOne({
      where: {
        id: file_id,
        userId: user.id,
      },
    });
  }

  async getDocumentsMeta(user: User): Promise<Document[]> {
    const queryBuilder = this.createQueryBuilder('document');
    queryBuilder.andWhere('document.userId = :userId', { userId: user.id });
    return queryBuilder.getMany();
  }

  async createDocument({
    fileName,
    filePath,
    user,
  }: {
    fileName: string;
    filePath: string;
    user: User;
  }): Promise<Document> {
    const { size } = fs.statSync(filePath);
    const document = new Document(user, fileName, size);
    await document.save();
    return document;
  }
}
