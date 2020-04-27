import { Inject, Injectable } from '@nestjs/common';
import { randomUUID10 } from '../shared';
import { createGDriveDownloadTask } from './helpers/uploads';
import { NodeService } from '../node/node.service';
import { DocumentService } from './document.service';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../user/entities/user.entity';
import { createWriteStream } from 'fs';
import { FileUpload } from './helpers/graphql';
import { DocumentSubscription } from './entities/document-subscription.entity';
@Injectable()
export class ImportsService {
  constructor(
    private nodeService: NodeService,
    private documentService: DocumentService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async importDocumentsFromGDrive(
    gDriveFileIDs: string[],
    user: User,
    access_token: string,
  ): Promise<void> {
    for (const gDriveFileId of gDriveFileIDs) {
      const documentID = randomUUID10();
      let fileName = '';
      try {
        DocumentSubscription.dispatch.importPreparing(documentID, fileName);
        const download = await createGDriveDownloadTask({
          access_token,
          fileId: gDriveFileId,
        });
        fileName = download.fileName;
        await download.start();
        DocumentSubscription.dispatch.importStarted(documentID, fileName);
        await this.documentService.saveDocument({
          id: documentID,
          user,
          fileName: fileName,
          filePath: '/uploads/' + fileName,
        });
        DocumentSubscription.dispatch.importFinished(documentID, fileName);
      } catch (e) {
        DocumentSubscription.dispatch.importFailed(documentID, fileName);
      }
    }
  }

  async importFromGraphqlClient(
    { filename, createReadStream }: FileUpload,
    user: User,
  ): Promise<void> {
    const documentID = randomUUID10();
    try {
      DocumentSubscription.dispatch.importPreparing(documentID, filename);
      const filePath = `${process.env.UPLOADS_PATH}${filename}`;
      await new Promise((resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false)),
      );
      DocumentSubscription.dispatch.importStarted(documentID, filename);
      await this.documentService.saveDocument({
        id: documentID,
        user,
        fileName: filename,
        filePath,
      });
      DocumentSubscription.dispatch.importFinished(documentID, filename);
    } catch (e) {
      DocumentSubscription.dispatch.importFailed(documentID, filename);
    }
  }
}
