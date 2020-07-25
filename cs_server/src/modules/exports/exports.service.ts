import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { NodeService } from '../node/node.service';
import { ExportCTB } from './helpers/export-ctb';
import fs, { ReadStream } from 'fs';
import { ImageService } from '../image/image.service';
import { DocumentSubscriptionsService } from '../document/document.subscriptions.service';
import { Document, Privacy } from '../document/entities/document.entity';
import { deleteFolder } from '../shared/fs/delete-folder';
import { paths } from '../shared/fs/paths';
import { resolveFileLocation } from '../shared/fs/resolve-file-location';
import { GetDocumentDTO } from '../document/dto/document.dto';
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

  async onModuleInit(): Promise<void> {
    await deleteFolder(paths.exportsFolder, true);
  }
  private scheduleDeletion = async (
    document: Document,
    exportCTB: ExportCTB,
  ): Promise<void> => {
    if (this.deleteTimeouts[document.hash])
      clearInterval(this.deleteTimeouts[document.hash]);
    this.deleteTimeouts[document.hash] = setTimeout(() => {
      deleteFolder(exportCTB.getFileLocation.folder).then(() => {
        delete this.deleteTimeouts[document.hash];
      });
    }, 30 * 60 * 1000);
  };

  exportDocument = async (dto: GetDocumentDTO): Promise<string> => {
    const { userId } = dto;
    const document = await this.documentService.getDocumentById(dto);
    const exportCTB = new ExportCTB({
      id: document.id,
      name: document.name,
      hash: document.hash,
      userId,
    });
    try {
      await this.subscriptionsService.export.pending(document, userId);
      await this.subscriptionsService.export.preparing(document, userId);
      const nodes = await this.nodeService.getNodesMetaAndAHtml({
        documentId: document.id,
        minimumPrivacy: Privacy.GUESTS_ONLY,
        userId,
      });
      await exportCTB.createCtb();
      await exportCTB.createTables();
      await this.subscriptionsService.export.nodesStarted(document, userId);
      const imagesPerNode = await exportCTB.writeAHtmls(nodes);
      await this.subscriptionsService.export.imagesStarted(document, userId);
      await exportCTB.writeNodesImages({
        imagesPerNode,
        getNodeImages: this.imageService.getLoadedImages,
      });
      await exportCTB.closeCtb();
      await this.scheduleDeletion(document, exportCTB);
      await this.subscriptionsService.export.finished(document, userId);
      return exportCTB.getFileLocation.relativePath;
    } catch (e) {
      await this.subscriptionsService.export.failed(document, userId);
      await exportCTB.closeCtb();
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
  };

  createDownloadStream = ({
    userId,
    documentHash,
    documentName,
  }: {
    userId: string;
    documentId: string;
    documentHash: string;
    documentName: string;
  }): ReadStream | undefined => {
    const { path } = resolveFileLocation({
      extension: 'ctb',
      userId,
      timeStamp: documentHash,
      fileName: documentName,
      type: 'export',
    });
    if (fs.existsSync(path)) return fs.createReadStream(path);
    else {
      throw new NotFoundException();
    }
  };
}
