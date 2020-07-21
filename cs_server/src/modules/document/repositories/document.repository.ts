import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Document } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';
import {
  DOCUMENT_SUBSCRIPTIONS as DS,
  DOCUMENT_SUBSCRIPTIONS,
} from '../entities/document-subscription.entity';
import { CreateDocumentDTO } from '../../imports/imports.service';
import { NotFoundException } from '@nestjs/common';
import { createErrorDescription } from '../../shared/errors/create-error-description';
import { GetDocumentDTO } from '../document.service';
import {
  DocumentOwner,
  OwnershipLevel,
} from '../entities/document.owner.entity';

const nullableEvents = [
  DS.IMPORT_FINISHED,
  DS.EXPORT_FINISHED,
  DS.EXPORT_FAILED,
];
const documentMetaFields = [
  `d.id`,
  `d.name`,
  `d.size`,
  `d.createdAt`,
  `d.updatedAt`,
  `d.status`,
  `d.nodes`,
  `d.hash`,
];
const select = () => documentMetaFields;

export type EditDocumentDTO = {
  getDocumentDTO: GetDocumentDTO;
  meta: Record<string, any>;
  updater?: (document: Document) => Document;
};

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
  async getDocumentById({
    userId,
    documentId,
    ownership,
    publicAccess,
  }: GetDocumentDTO): Promise<Document> {
    const document = await this.createQueryBuilder('d')
      .leftJoin(DocumentOwner, 'n_o', 'n_o."documentId" = d.id ')
      .select(select())
      .andWhere(
        `( (n_o."userId" = :userId AND n_o."ownershipLevel" >= :ownership)  ${
          publicAccess ? 'OR n_o."public" = true' : ''
        })`,
        { userId, ownership },
      )
      .andWhere('n_o."documentId" = :documentId', { documentId })
      .getOne();
    if (!document)
      throw new NotFoundException(
        createErrorDescription.documentNotExist(documentId),
      );
    return document;
  }

  async getDocuments({
    userId,
    ownership,
    publicAccess,
  }: GetDocumentDTO): Promise<Document[]> {
    return await this.createQueryBuilder('d')
      .leftJoin(DocumentOwner, 'n_o', 'n_o."documentId" = d.id ')
      .select(select())
      .andWhere(
        `( (n_o."userId" = :userId AND n_o."ownershipLevel" >= :ownership)  ${
          publicAccess ? 'OR n_o."public" = true' : ''
        })`,
        { userId, ownership },
      )
      .getMany();
  }

  async createDocument({ name, size }: CreateDocumentDTO): Promise<Document> {
    const document = new Document(name, size);
    await document.save();
    return document;
  }

  private async updateDocument({
    meta,
    getDocumentDTO,
    updater,
  }: EditDocumentDTO): Promise<Document> {
    let document = await this.getDocumentById(getDocumentDTO);
    Object.entries(meta).forEach(([k, v]) => {
      document[k] = v;
    });
    if (updater) document = updater(document);
    document.size = await this.getSize({
      documentId: getDocumentDTO.documentId,
    });
    await this.save(document);
    return document;
  }
  async editDocument({
    getDocumentDTO,
    meta,
    updater,
  }: EditDocumentDTO): Promise<Document> {
    return await this.updateDocument({
      getDocumentDTO,
      meta: {
        ...meta,
        updatedAt: meta.updatedAt ? new Date(meta.updatedAt) : new Date(),
      },
      updater,
    });
  }

  async deleteDocuments(IDs: string[], user: User): Promise<string[]> {
    const documents = await Promise.all(
      IDs.map(documentId =>
        this.getDocumentById({
          userId: user.id,
          documentId,
          ownership: OwnershipLevel.OWNER,
        } as GetDocumentDTO),
      ),
    );
    await this.remove(documents);
    return IDs;
  }
  async markUnfinishedImportsAsFailed(): Promise<UpdateResult> {
    const queryBuilder = this.createQueryBuilder('document');
    return await queryBuilder
      .update(Document)
      .set({ status: DOCUMENT_SUBSCRIPTIONS.IMPORT_FAILED })
      .where('document.status is not null')
      .execute();
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
