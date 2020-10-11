import { Injectable } from '@nestjs/common';
import { performDownload } from './helpers/download/perform-download/perform-download';
import { User } from '../user/entities/user.entity';
import { ImageService } from '../image/image.service';
import { DocumentService } from '../document/document.service';
import { Document, Privacy } from '../document/entities/document.entity';
import { FileUpload } from '../document/helpers/graphql';
import { AddImageDTO } from './dto/upload-image.dto';
import { NodeService } from '../node/node.service';
import { ImportCTB } from './helpers/import-ctb/import-ctb';
import { SubscriptionsService } from '../document/subscriptions.service';
import {
  createGDriveDownloadTask,
  DownloadTask,
  DownloadTaskCreator,
  DownloadTaskProps,
  FileMeta,
} from './helpers/download/create-dowload-task/create-gdrive-download-task';
import { createGqlDownloadTask } from './helpers/download/create-dowload-task/create-gql-download-task';
import { deleteFolder } from '../shared/fs/delete-folder';
import { paths } from '../shared/fs/paths';

@Injectable()
export class ImportsService {
  constructor(
    private documentService: DocumentService,
    private imageService: ImageService,
    private nodeService: NodeService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await deleteFolder(paths.importsFolder, true);
  }

  private async saveDocument({
    document,
    user,
    fileMeta,
  }: {
    document: Document;
    user: User;
    fileMeta: FileMeta;
  }): Promise<void> {
    const importCTB = new ImportCTB(
      dto => this.nodeService.createNode(dto),
      user,
    );
    await importCTB.saveDocument({
      document,
      fileMeta,
    });
    document.size = await this.documentService.getSize({
      documentId: document.id,
    });
    await document.save();
  }
  async importDocumentsFromGDrive(
    gDriveFileIds: string[],
    user: User,
    access_token: string,
  ): Promise<void> {
    await this.importDocument(
      gDriveFileIds.map(gDriveFileId => ({ gDriveFileId, userId: user.id })),
      user,
      createGDriveDownloadTask(access_token),
    );
  }

  async importFromGraphqlClient(
    files: FileUpload[],
    user: User,
  ): Promise<void> {
    await this.importDocument(
      files.map(fileUpload => ({ fileUpload, userId: user.id })),
      user,
      createGqlDownloadTask,
    );
  }

  async importImages({
    images,
    getNodeDTO,
  }: AddImageDTO): Promise<[string, string][]> {
    const imageIDs: string[] = [];
    const pngs: { png: Buffer; hash: string }[] = [];
    for (const file of images) {
      const { createReadStream, filename } = await file;
      const chunksContainer = { current: [] };
      const { hash } = await performDownload(
        { readStream: createReadStream(), chunksContainer },
        () => Promise.resolve(),
      );
      const buffer = Buffer.concat(chunksContainer.current);
      pngs.push({ png: buffer, hash });
      imageIDs.push(filename);
    }

    const node = await this.nodeService.getNodeById(getNodeDTO);

    const { node_idImagesMap } = await ImportCTB.saveImages([[node, pngs]]);
    return node_idImagesMap
      .get(getNodeDTO.node_id)
      .map((id, i) => [imageIDs[i], id]);
  }

  async importDocument(
    meta: DownloadTaskProps[],
    user: User,
    taskCreator: DownloadTaskCreator,
  ): Promise<void> {
    const documents: {
      document: Document;
      downloadTask: DownloadTask;
    }[] = [];
    const operationId = 'import_' + Date.now();
    for (const file of meta) {
      let document;
      try {
        const downloadTask = await taskCreator(file);
        document = await this.documentService.createDocument({
          data: {
            name: downloadTask.fileMeta.fileName,
            privacy: Privacy.PRIVATE,
            guests: [],
          },
          userId: user.id,
        });

        documents.push({
          document,
          downloadTask,
        });
        await this.subscriptionsService.import.pending(
          document,
          user.id,
          operationId,
        );
      } catch (e) {
        await this.subscriptionsService.import.failed(
          document,
          user.id,
          operationId,
        );
        throw e;
      }
    }
    for (const { document, downloadTask } of documents) {
      try {
        await this.subscriptionsService.import.preparing(
          document,
          user.id,
          operationId,
        );
        const { hash } = await performDownload(downloadTask, async () => {
          await document.reload();
        });
        const documentWithSameHash = await this.documentService.findDocumentByHash(
          hash,
        );
        if (documentWithSameHash) {
          await this.subscriptionsService.import.duplicate(
            document,
            user.id,
            operationId,
          );
          await this.documentService.deleteDocuments([document.id], user, {
            notifySubscribers: false,
          });
        } else {
          await this.subscriptionsService.import.started(
            document,
            user.id,
            operationId,
          );
          await this.saveDocument({
            document,
            user,
            fileMeta: downloadTask.fileMeta,
          });
          await this.subscriptionsService.import.finished(
            document,
            user.id,
            operationId,
          );
          await deleteFolder(downloadTask.fileMeta.location.folder);
        }
      } catch (e) {
        await this.subscriptionsService.import.failed(
          document,
          user.id,
          operationId,
        );
        await deleteFolder(downloadTask.fileMeta.location.folder);
        throw e;
      }
    }
  }
}
