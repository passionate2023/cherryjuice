import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import { IDocumentRepository } from '../interfaces/document.repository';
import { Document } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';
import { DOCUMENT_SUBSCRIPTIONS } from '../entities/document-subscription.entity';
import { DocumentDTO } from '../../imports/imports.service';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document>
  implements IDocumentRepository {
  async getDocumentMetaById(user: User, file_id: string): Promise<Document> {
    const document = await this.findOne({
      where: {
        id: file_id,
        userId: user.id,
      },
    });
    if (!document)
      throw new NotFoundException(
        `document ${file_id} does not exist in your library`,
      );
    return document;
  }

  async getDocumentsMeta(user: User): Promise<Document[]> {
    const queryBuilder = this.createQueryBuilder('document');
    queryBuilder.andWhere('document.userId = :userId', { userId: user.id });
    return queryBuilder.getMany();
  }

  async createDocument({
    name,
    size,
    id,
    user,
  }: DocumentDTO): Promise<Document> {
    const document = new Document(user, name, size, id);
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

  async markUnfinishedImportsAsFailed(): Promise<UpdateResult> {
    const queryBuilder = this.createQueryBuilder('document');
    return await queryBuilder
      .update(Document)
      .set({ status: DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED })
      .where('document.status is not null')
      .execute();
  }
}
