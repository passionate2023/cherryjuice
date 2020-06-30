import { Injectable } from '@nestjs/common';
import { performDownload } from './helpers/download/perform-download/perform-download';
import { User } from '../user/entities/user.entity';
import { ImageService } from '../image/image.service';
import { DocumentService } from '../document/document.service';
import { Document } from '../document/entities/document.entity';
import { FileUpload } from '../document/helpers/graphql';
import { UploadImageDto } from './dto/upload-image.dto';
import { NodeService } from '../node/node.service';
import { ImportCTB } from './helpers/import-ctb/import-ctb';
import { DocumentSubscriptionsService } from '../document/document.subscriptions.service';
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
    const importCTB = new ImportCTB();

    await importCTB.saveDocument({
      document,
      fileMeta,
    });
    document.size = await this.documentService.getSize({
      documentId: document.id,
      user,
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
    node_id,
    user,
    documentId,
  }: UploadImageDto): Promise<[string, string][]> {
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

    const node = await this.nodeService.getNodeMetaById({
      documentId,
      node_id,
      user,
    });

    const { node_idImagesMap } = await ImportCTB.saveImages([[node, pngs]]);
    return node_idImagesMap.get(node_id).map((id, i) => [imageIDs[i], id]);
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

    for (const file of meta) {
      let document;
      try {
        const downloadTask = await taskCreator(file);
        document = await this.documentService.createDocument({
          name: downloadTask.fileMeta.fileName,
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
        const { hash } = await performDownload(downloadTask, async () => {
          await document.reload();
        });
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
            fileMeta: downloadTask.fileMeta,
          });
          await this.subscriptionsService.import.finished(document);
          await deleteFolder(downloadTask.fileMeta.location.folder);
        }
      } catch (e) {
        await this.subscriptionsService.import.failed(document);
        await deleteFolder(downloadTask.fileMeta.location.folder);
        throw e;
      }
    }
  }
}
