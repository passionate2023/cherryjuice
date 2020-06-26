import { Injectable } from '@nestjs/common';
import { ExportDocumentDto } from './dto/export-document.dto';
import { DocumentService } from '../document/document.service';
import { NodeService } from '../node/node.service';
import { ExportCTB } from './helpers/export-ctb';
import fs, { ReadStream } from 'fs';
import { ImageService } from '../image/image.service';
import { DocumentSubscriptionsService } from '../document/document.subscriptions.service';

@Injectable()
export class ExportsService {
  constructor(
    private documentService: DocumentService,
    private subscriptionsService: DocumentSubscriptionsService,
    private nodeService: NodeService,
    private imageService: ImageService,
  ) {}
  exportDocument = async ({
    documentId,
    user,
  }: ExportDocumentDto): Promise<string> => {
    const document = await this.documentService.getDocumentMetaById(
      user,
      documentId,
    );
    try {
      await this.subscriptionsService.export.pending(document);
      const nodes = await this.nodeService.getNodesMetaAndAHtml(documentId);
      await this.subscriptionsService.export.preparing(document);
      const exportCTB = new ExportCTB(document);
      await exportCTB.createCtb();
      await exportCTB.createTables();
      await this.subscriptionsService.export.nodesStarted(document);
      const imagesPerNode = await exportCTB.writeAHtmls(nodes);
      await this.subscriptionsService.export.imagesStarted(document);
      await exportCTB.writeNodesImages({
        imagesPerNode,
        getNodeImages: this.imageService.getLoadedImages,
      });
      await this.subscriptionsService.export.finished(document);
      await exportCTB.closeCtb();
      return exportCTB.getDocumentRelativePath;
    } catch (e) {
      await this.subscriptionsService.export.failed(document);
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
  };

  createDownloadStream = ({
    userId,
    documentId,
    documentHash,
    documentName,
  }: {
    userId: string;
    documentId: string;
    documentHash: string;
    documentName: string;
  }): ReadStream => {
    return fs.createReadStream(
      `/.cs/exports/${userId}/${documentId}/${documentHash}/${documentName}.ctb`,
    );
  };
}
