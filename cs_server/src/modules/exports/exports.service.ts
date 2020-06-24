import { Injectable } from '@nestjs/common';
import { ExportDocumentDto } from './dto/export-document.dto';
import { DocumentService } from '../document/document.service';
import { NodeService } from '../node/node.service';
import { ExportCTB } from './helpers/export-ctb';
import fs, { ReadStream } from 'fs';
import { User } from '../user/entities/user.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class ExportsService {
  constructor(
    private documentService: DocumentService,
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
    const nodes = await this.nodeService.getNodesMetaAndAHtml(documentId);
    const exportCTB = new ExportCTB(document.name, user.id, {
      addSuffixToDocumentName: true,
    });
    await exportCTB.createCtb();
    await exportCTB.createTables();
    const imagesPerNode = await exportCTB.writeAHtmls(nodes);
    await exportCTB.writeNodesImages({
      imagesPerNode,
      getNodeImages: this.imageService.getLoadedImages,
    });

    await exportCTB.closeCtb();
    return exportCTB.getDocumentName;
  };

  createDownloadStream = ({
    documentName,
    user,
  }: {
    user: User;
    documentName: string;
  }): ReadStream => {
    return fs.createReadStream(`/.cs/exports/user-${user.id}/${documentName}`);
  };
}
