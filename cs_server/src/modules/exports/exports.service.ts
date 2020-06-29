import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportDocumentDto } from './dto/export-document.dto';
import { DocumentService } from '../document/document.service';
import { NodeService } from '../node/node.service';
import { ExportCTB, exportsFolder } from './helpers/export-ctb';
import fs, { ReadStream } from 'fs';
import { ImageService } from '../image/image.service';
import { DocumentSubscriptionsService } from '../document/document.subscriptions.service';
import { Document } from '../document/entities/document.entity';
import { deleteFolder } from '../shared/delete-folder';
import Timeout = NodeJS.Timeout;

@Injectable()
export class ExportsService {
  private deleteTimeouts: { [hash: string]: Timeout } = {};
  constructor(
    private documentService: DocumentService,
    private subscriptionsService: DocumentSubscriptionsService,
    private nodeService: NodeService,
    private imageService: ImageService,
  ) {}

  onModuleInit(): void {
    deleteFolder(exportsFolder, true);
  }
  private scheduleDeletion = async (
    document: Document,
    exportCTB: ExportCTB,
  ): Promise<void> => {
    if (this.deleteTimeouts[document.hash])
      clearInterval(this.deleteTimeouts[document.hash]);
    this.deleteTimeouts[document.hash] = setTimeout(() => {
      deleteFolder(exportCTB.getDocumentFolder).then(() => {
        delete this.deleteTimeouts[document.hash];
      });
    }, 30 * 60 * 1000);
  };

  exportDocument = async ({
    documentId,
    user,
  }: ExportDocumentDto): Promise<string> => {
    const document = await this.documentService.getDocumentMetaById(
      user,
      documentId,
    );
    const exportCTB = new ExportCTB(document);
    try {
      await this.subscriptionsService.export.pending(document);
      await this.subscriptionsService.export.preparing(document);
      const nodes = await this.nodeService.getNodesMetaAndAHtml(documentId);
      await exportCTB.createCtb();
      await exportCTB.createTables();
      await this.subscriptionsService.export.nodesStarted(document);
      const imagesPerNode = await exportCTB.writeAHtmls(nodes);
      await this.subscriptionsService.export.imagesStarted(document);
      await exportCTB.writeNodesImages({
        imagesPerNode,
        getNodeImages: this.imageService.getLoadedImages,
      });
      await exportCTB.closeCtb();
      await this.scheduleDeletion(document, exportCTB);
      await this.subscriptionsService.export.finished(document);
      return exportCTB.getDocumentRelativePath;
    } catch (e) {
      await this.subscriptionsService.export.failed(document);
      await exportCTB.closeCtb();
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
  }): ReadStream | undefined => {
    const fullPath = `/.cs/exports/${userId}/${documentId}/${documentHash}/${documentName}.ctb`;
    if (fs.existsSync(fullPath)) return fs.createReadStream(fullPath);
    else {
      throw new NotFoundException();
    }
  };
}
