import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import { IDocumentRepository } from '../interfaces/document.repository';
import { Document } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';
import {
  DOCUMENT_SUBSCRIPTIONS as DS,
  DOCUMENT_SUBSCRIPTIONS,
} from '../entities/document-subscription.entity';
import { DocumentDTO } from '../../imports/imports.service';
import { NotFoundException } from '@nestjs/common';
import { EditDocumentDto } from '../input-types/edit-document.dto';
const nullableEvents = [
  DS.IMPORT_FINISHED,
  DS.EXPORT_FINISHED,
  DS.EXPORT_FAILED,
];
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

  async createDocument({ name, size, user }: DocumentDTO): Promise<Document> {
    const document = new Document(user, name, size);
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
      .set({ status: DOCUMENT_SUBSCRIPTIONS.IMPORT_FAILED })
      .where('document.status is not null')
      .execute();
  }

  private async updateDocument({
    documentId,
    meta,
    user,
  }: {
    user: User;
    documentId: string;
    meta: Record<string, any>;
  }): Promise<Document> {
    const document = await this.findOneOrFail({
      id: documentId,
      userId: user.id,
    });
    Object.entries(meta).forEach(([k, v]) => {
      document[k] = v;
    });
    document.size = await this.getSize({ documentId });
    await this.save(document);
    return document;
  }

  async editDocument({
    documentId,
    meta,
    user,
  }: EditDocumentDto): Promise<string> {
    const document = await this.updateDocument({
      documentId,
      user,
      meta: {
        ...meta,
        updatedAt: new Date(meta.updatedAt),
      },
    });

    return document.id;
  }

  async getSize({ documentId }: { documentId: string }): Promise<number> {
    return await this.manager
      .query(
        `
    select (
    (select sum(pg_column_size(i.*)) from image as i where i."documentId"=$1) +
    (select sum(pg_column_size(n.*)) from node as n where n."documentId"=$1)
   ) /1024 as kb
    `,
        [documentId],
      )

      .then(res => Number(res[0].kb));
  }

  setDocumentStatus = async (event: DS, document: Document): Promise<void> => {
    document.status = nullableEvents.includes(event) ? null : event;
    if (event !== DS.DELETED) {
      await this.save(document);
    }
  };
}
