import { IDocumentRepository } from '../interfaces/document.repository';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import fs from 'fs';
import { User } from '../../user/entities/user.entity';

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
    id,
    user,
  }: {
    fileName: string;
    filePath: string;
    id: string;
    user: User;
  }): Promise<Document> {
    const { size } = fs.statSync(filePath);
    const document = new Document(user, fileName, size, id);
    await document.save();
    return document;
  }

  async deleteDocuments(IDs: string[], user: User): Promise<DeleteResult> {
    const queryBuilder = this.createQueryBuilder();
    return await queryBuilder
      .delete()
      .where('userId = :userId', { userId: user.id })
      .andWhereInIds(IDs)
      .execute();
  }
}
