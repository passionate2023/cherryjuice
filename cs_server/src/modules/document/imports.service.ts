import { Injectable } from '@nestjs/common';
import { randomUUID10 } from '../shared';
import { createGDriveDownloadTask } from './helpers/uploads';
import { NodeService } from '../node/node.service';
import { DocumentService } from './document.service';
import { User } from '../user/entities/user.entity';
import { createWriteStream } from 'fs';
import { FileUpload } from './helpers/graphql';
import { DocumentSubscription } from './entities/document-subscription.entity';
@Injectable()
export class ImportsService {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
  ) {}

  async importDocumentsFromGDrive(
    gDriveFileIDs: string[],
    user: User,
    access_token: string,
  ): Promise<void> {
    for (const gDriveFileId of gDriveFileIDs) {
      const documentID = randomUUID10();
      let document;
      try {
        document = await this.documentService.createDocument({
          fileName: '',
          size: 0,
          user,
          id: documentID,
        });
        const download = await createGDriveDownloadTask({
          access_token,
          fileId: gDriveFileId,
        });
        document.name = download.fileName;
        await DocumentSubscription.dispatch.importPreparing(document);

        await download.start();
        await DocumentSubscription.dispatch.importStarted(document);
        await this.documentService.saveDocument({
          document,
        });
        await DocumentSubscription.dispatch.importFinished(document);
      } catch (e) {
        await DocumentSubscription.dispatch.importFailed(document);
      }
    }
  }

  async importFromGraphqlClient(
    { filename, createReadStream }: FileUpload,
    user: User,
  ): Promise<void> {
    const documentID = randomUUID10();
    let document;
    try {
      document = await this.documentService.createDocument({
        fileName: filename,
        size: 0,
        user,
        id: documentID,
      });
      await DocumentSubscription.dispatch.importPreparing(document);
      const filePath = `${process.env.UPLOADS_PATH}${filename}`;
      await new Promise((resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false)),
      );
      await DocumentSubscription.dispatch.importStarted(document);
      await this.documentService.saveDocument({
        document,
      });
      await DocumentSubscription.dispatch.importFinished(document);
    } catch (e) {
      await DocumentSubscription.dispatch.importFailed(document);
      await this.documentService.deleteDocuments([document.id], user);
      throw e;
    }
  }
}
