import { EntityRepository, Repository } from 'typeorm';
import { Document, Privacy } from '../entities/document.entity';
import { User } from '../../user/entities/user.entity';
import {
  OPERATION_TYPE,
  OPERATION_STATE,
  DocumentOperation,
} from '../entities/document-operation.entity';
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
import { DocumentState } from '../entities/document-state.entity';
import { DocumentNotExistException } from '../exceptions/document-not-exist.exception';
import { DocumentCantBeEditedException } from '../exceptions/document-cant-be-edited.exception';
import { DocumentCantBeRemovedException } from '../exceptions/document-cant-be-removed.exception';

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
  `d.folderId`,
  `d.state`,
  `g.userId`,
  `g.accessLevel`,
  `g.email`,
];
const select = () => documentMetaFields;

const removeDocumentStateForNonOwner = (userId: string) => (
  document: Document,
): Document =>
  document.userId === userId
    ? document
    : ((document.state = new DocumentState(true)), document);

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
    if (!document) throw new DocumentNotExistException(dto.documentId);

    return removeDocumentStateForNonOwner(dto.userId)(document);
  }

  async getWDocumentById(dto: GetDocumentDTO): Promise<Document> {
    const document = await this._getDocumentById(dto, true);
    if (!document) throw new DocumentCantBeEditedException(dto.documentId);
    return document;
  }

  async getDocuments(dto: GetDocumentsDTO): Promise<Document[]> {
    return (
      await this.baseQueryBuilder(dto, {
        write: false,
        single: false,
      }).getMany()
    ).map(removeDocumentStateForNonOwner(dto.userId));
  }

  async createDocument({
    data: { name, privacy, folderId },
    userId,
  }: CreateDocumentDTO): Promise<Document> {
    const document = new Document({ name, userId, privacy, folderId });
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
      throw new DocumentCantBeEditedException(getDocumentDTO.documentId);

    if ('state' in meta && document.state.updatedAt > meta.state.updatedAt)
      return document;

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

    const ownedDocuments = documents.filter(
      document => document.userId === user.id,
    );
    await this.remove(ownedDocuments);
    if (ownedDocuments.length < documents.length)
      throw new DocumentCantBeRemovedException();
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
