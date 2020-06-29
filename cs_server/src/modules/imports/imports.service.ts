import { Injectable } from '@nestjs/common';
import {
  createGDriveDownloadTask,
  createGqlDownloadTask,
  cleanUploadsFolder,
  download,
  TDownloadTask,
  TDownloadTaskCreator,
  TDownloadTaskProps,
} from './helpers/io';
import { User } from '../user/entities/user.entity';
import { ImageService } from '../image/image.service';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/entities/document.entity';
import { FileUpload } from '../document/helpers/graphql';
import { UploadImageDto } from './dto/upload-image.dto';
import { NodeService } from '../node/node.service';
import { ImportCTB } from './helpers/import-ctb/import-ctb';
import { DocumentSubscriptionsService } from '../document/document.subscriptions.service';
export type DocumentDTO = {
  name: string;
  size: number;
  user: User;
};

@Injectable()
export class ImportsService {
  constructor(
    private documentService: DocumentService,
    private imageService: ImageService,
    private nodeService: NodeService,
    private subscriptionsService: DocumentSubscriptionsService,
  ) {}

  onModuleInit(): void {
    cleanUploadsFolder();
  }

  private async saveDocument({
    document,
    user,
  }: {
    document: Document;
    user: User;
  }): Promise<void> {
    document.name = document.name.replace(/\.ctb$/, '');

    const importCTB = new ImportCTB();

    const pgDocument = await importCTB.saveDocument({
      document,
    });
    pgDocument.size = await this.documentService.getSize({
      documentId: pgDocument.id,
      user,
    });
    await pgDocument.save();
  }
  async importDocumentsFromGDrive(
    meta: string[],
    user: User,
    access_token: string,
  ): Promise<void> {
    await this.importDocument(
      meta,
      user,
      createGDriveDownloadTask(access_token),
    );
  }

  async importFromGraphqlClient(
    files: FileUpload[],
    user: User,
  ): Promise<void> {
    await this.importDocument(files, user, createGqlDownloadTask);
  }

  async importImages({
    images,
    node_id,
    user,
    documentId,
  }: UploadImageDto): Promise<[string, string][]> {
    const imageIDs: string[] = [];
    const pngs: { png: Buffer; hash: string }[] = [];
    for (const file of images) {
      const { createReadStream, filename } = await file;
      const chunksContainer = { current: [] };
      const { hash } = await download(
        { readStream: createReadStream(), chunksContainer },
        () => Promise.resolve(),
      );
      const buffer = Buffer.concat(chunksContainer.current);
      pngs.push({ png: buffer, hash });
      imageIDs.push(filename);
    }

    const node = await this.nodeService.getNodeMetaById({
      documentId,
      node_id,
      user,
    });

    const { node_idImagesMap } = await ImportCTB.saveImages([[node, pngs]]);
    return node_idImagesMap.get(node_id).map((id, i) => [imageIDs[i], id]);
  }

  async importDocument(
    meta: TDownloadTaskProps[],
    user: User,
    taskCreator: TDownloadTaskCreator,
  ): Promise<void> {
    const documents: {
      document: Document;
      downloadTask: TDownloadTask;
    }[] = [];

    for (const file of meta) {
      let document;
      try {
        const downloadTask = await taskCreator(file);
        document = await this.documentService.createDocument({
          name: downloadTask.fileName,
          size: 0,
          user,
        });

        documents.push({
          document,
          downloadTask,
        });
        await this.subscriptionsService.import.pending(document);
      } catch (e) {
        await this.subscriptionsService.import.failed(document);
        throw e;
      }
    }
    for (const { document, downloadTask } of documents) {
      try {
        await this.subscriptionsService.import.preparing(document);
        const { hash } = await download(downloadTask, document.reload);
        const documentWithSameHash = await this.documentService.findDocumentByHash(
          hash,
          user,
        );
        if (documentWithSameHash) {
          await this.subscriptionsService.import.duplicate(document);
          await this.documentService.deleteDocuments([document.id], user, {
            notifySubscribers: false,
          });
        } else {
          await this.subscriptionsService.import.started(document);
          await this.saveDocument({
            document,
            user,
          });
          await this.subscriptionsService.import.finished(document);
        }
      } catch (e) {
        await this.subscriptionsService.import.failed(document);
        throw e;
      }
    }
    cleanUploadsFolder();
  }
}
