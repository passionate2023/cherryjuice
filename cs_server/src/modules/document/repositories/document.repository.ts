import { EntityRepository, Repository } from 'typeorm';
import { Document, Privacy } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';
import {
  OPERATION_TYPE,
  OPERATION_STATE,
  DocumentOperation,
} from '../entities/document-operation.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createErrorDescription } from '../../shared/errors/create-error-description';
import { AccessLevel, DocumentGuest } from '../entities/document-guest.entity';
import {
  CreateDocumentDTO,
  EditDocumentDTO,
  GetDocumentDTO,
  GetDocumentsDTO,
  SetDocumentStateDTO,
} from '../dto/document.dto';
import {
  and_,
  or_,
} from '../../search/helpers/pg-queries/helpers/clause-builder';
import { RunFirst } from '../../node/repositories/node.repository';

const nullableEvents = [OPERATION_STATE.FINISHED, OPERATION_STATE.FAILED];
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
  `d.state`,
  `g.userId`,
  `g.accessLevel`,
  `g.email`,
];
const select = () => documentMetaFields;

export type GetterSettings = {
  write: boolean;
  runFirst?: RunFirst;
  single?: boolean;
};

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
  baseQueryBuilder = (
    { userId }: GetDocumentsDTO,
    { write, runFirst, single }: GetterSettings,
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
        .orIf(!write && single, `(d."privacy"  >= :publicPrivacy)`)
        .or(
          and_()
            .and(`g."userId" = :userId `)
            .and(`d."privacy"  >= :guestOnlyPrivacy`)
            .andIf(write, `g."accessLevel" >= :writeAccessLevel`),
        )
        ._(),
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
      single: true,
      runFirst: queryBuilder =>
        queryBuilder.andWhere('d."id" = :documentId', {
          documentId: dto.documentId,
        }),
    }).getOne();

    return document;
  }

  async getDocumentById(dto: GetDocumentDTO): Promise<Document> {
    const document = await this._getDocumentById(dto, false);
    if (!document)
      throw new NotFoundException(
        createErrorDescription.document.doesNotExist(dto.documentId),
      );
    return document;
  }

  async getWDocumentById(dto: GetDocumentDTO): Promise<Document> {
    const document = await this._getDocumentById(dto, true);
    if (!document)
      throw new NotFoundException(
        createErrorDescription.document.notEnoughAccessLevel(dto.documentId),
      );
    return document;
  }

  async getDocuments(dto: GetDocumentsDTO): Promise<Document[]> {
    return await this.baseQueryBuilder(dto, {
      write: false,
      single: false,
    }).getMany();
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
  }: EditDocumentDTO | SetDocumentStateDTO): Promise<Document> {
    const entries = Object.entries(meta);
    const document = await this.getWDocumentById(getDocumentDTO);
    const isDocumentOwner = document.userId === getDocumentDTO.userId;
    const onlyATimeStampEdit =
      entries.length === 1 && entries[0][0] === 'updatedAt';
    if (!isDocumentOwner && !onlyATimeStampEdit)
      throw new NotFoundException(
        createErrorDescription.document.notEnoughAccessLevel(
          getDocumentDTO.documentId,
        ),
      );
    entries.forEach(([k, v]) => {
      document[k] = v;
    });
    document.size = await this.getSize({
      documentId: getDocumentDTO.documentId,
    });
    await this.save(document);
    return document;
  }
  async editDocument({
    getDocumentDTO,
    meta,
  }: EditDocumentDTO): Promise<Document> {
    return await this.updateDocument({
      getDocumentDTO,
      meta: {
        ...meta,
        updatedAt:
          'updatedAt' in meta ? new Date(meta['updatedAt']) : new Date(),
      },
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
    );

    if (documents.some(document => document.userId !== user.id))
      throw new UnauthorizedException(
        createErrorDescription.document.notEnoughAccessLevel(),
      );
    await this.remove(documents);
    return IDs;
  }
  async markUnfinishedImportsAsFailed(): Promise<Document[]> {
    const queryBuilder = this.createQueryBuilder('d');
    const failedDocuments = await queryBuilder
      .where('d.status is not null')
      .getMany();
    for (const document of failedDocuments) {
      const currentStatus: DocumentOperation = await new Promise(res =>
        res(JSON.parse(document.status)),
      );
      if (currentStatus) {
        currentStatus.state = OPERATION_STATE.FAILED;
        document.status = JSON.stringify(currentStatus);
        await this.save(document);
      }
    }
    return failedDocuments;
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

  setDocumentStatus = async (
    event: DocumentOperation,
    document: Document,
  ): Promise<void> => {
    document.status = nullableEvents.includes(event.state)
      ? null
      : JSON.stringify(event);
    if (event.type !== OPERATION_TYPE.DELETE) {
      await this.save(document);
    }
  };

  async setState({
    getDocumentDTO,
    meta,
  }: SetDocumentStateDTO): Promise<Document> {
    return await this.updateDocument({
      getDocumentDTO,
      meta,
    });
  }
}
