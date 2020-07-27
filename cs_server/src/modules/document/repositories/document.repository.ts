import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Document, Privacy } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';
import {
  DOCUMENT_SUBSCRIPTIONS as DS,
  DOCUMENT_SUBSCRIPTIONS,
} from '../entities/document-subscription.entity';
import { NotFoundException } from '@nestjs/common';
import { createErrorDescription } from '../../shared/errors/create-error-description';
import { AccessLevel, DocumentGuest } from '../entities/document-guest.entity';
import {
  CreateDocumentDTO,
  EditDocumentDTO,
  GetDocumentDTO,
  GetDocumentsDTO,
} from '../dto/document.dto';
import {
  and_,
  or_,
} from '../../search/helpers/pg-queries/helpers/clause-builder';
import { RunFirst } from '../../node/repositories/node.repository';

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
  `d.hash`,
  `d.nodes`, // nodes hash
  `d.userId`,
  `d.privacy`,
  `g.userId`,
  `g.accessLevel`,
  `g.email`,
];
const select = () => documentMetaFields;

export type GetterSettings = { write: boolean; runFirst?: RunFirst };

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
  baseQueryBuilder = (
    { userId }: GetDocumentsDTO,
    { write, runFirst }: GetterSettings,
  ) => {
    let queryBuilder = this.createQueryBuilder('d')
      .leftJoinAndMapMany(
        'd.guests',
        DocumentGuest,
        'g',
        'g."documentId" = d.id ',
      )
      .select(select());
    if (runFirst) queryBuilder = runFirst<Document>(queryBuilder);
    return queryBuilder.andWhere(
      or_()
        .or(`d."userId" = :userId`)
        .orIf(!write, `(d."privacy"  >= :publicPrivacy)`)
        .or(
          and_()
            .and(`g."userId" = :userId `)
            .and(`d."privacy"  >= :guestOnlyPrivacy`)
            .andIf(write, `g."accessLevel" >= :writeAccessLevel`),
        )
        .get(),
      {
        userId,
        publicPrivacy: Privacy.PUBLIC,
        guestOnlyPrivacy: Privacy.GUESTS_ONLY,
        writeAccessLevel: AccessLevel.WRITER,
      },
    );
  };
  private async _getDocumentById(
    dto: GetDocumentDTO,
    write: boolean,
  ): Promise<Document> {
    const document = await this.baseQueryBuilder(dto, {
      write,
      runFirst: queryBuilder =>
        queryBuilder.andWhere('d."id" = :documentId', {
          documentId: dto.documentId,
        }),
    }).getOne();
    if (!document)
      throw new NotFoundException(
        createErrorDescription.documentNotExist(dto.documentId),
      );
    return document;
  }

  async getDocumentById(dto: GetDocumentDTO): Promise<Document> {
    return this._getDocumentById(dto, false);
  }

  async getWDocumentById(dto: GetDocumentDTO): Promise<Document> {
    return this._getDocumentById(dto, true);
  }

  async getDocuments(dto: GetDocumentsDTO): Promise<Document[]> {
    return await this.baseQueryBuilder(dto, { write: false }).getMany();
  }

  async createDocument({
    data: { name, privacy },
    userId,
  }: CreateDocumentDTO): Promise<Document> {
    const document = new Document({ name, userId, privacy });
    await document.save();
    return document;
  }

  private async updateDocument({
    meta,
    getDocumentDTO,
    updater,
  }: EditDocumentDTO): Promise<Document> {
    let document = await this.getWDocumentById(getDocumentDTO);
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
        this.getWDocumentById({
          userId: user.id,
          documentId,
        } as GetDocumentDTO),
      ),
    ).then(documents =>
      documents.filter(document => document.userId === user.id),
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
