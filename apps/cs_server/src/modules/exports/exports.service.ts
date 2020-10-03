import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentService } from '../document/document.service';
import { NodeService } from '../node/node.service';
import { ExportCTB } from './helpers/export-ctb';
import fs, { ReadStream } from 'fs';
import { ImageService } from '../image/image.service';
import { SubscriptionsService } from '../document/subscriptions.service';
import { Document } from '../document/entities/document.entity';
import { deleteFolder } from '../shared/fs/delete-folder';
import { paths } from '../shared/fs/paths';
import { resolveFileLocation } from '../shared/fs/resolve-file-location';
import { GetDocumentDTO } from '../document/dto/document.dto';
import Timeout = NodeJS.Timeout;

export type Notify = () => Promise<void>;
type ChunkifyProps = {
  totalSteps: number;
  stepsPerBatch: number;
  onProgress: (progress: number) => Promise<void>;
};
type Chunkify = (props: ChunkifyProps) => Notify;
export const chunkify: Chunkify = ({
  onProgress,
  stepsPerBatch,
  totalSteps,
}) => {
  const state = {
    progress: {
      current: 0,
      total: 0,
    },
  };
  return async () => {
    state.progress.total++;
    state.progress.current++;
    if (state.progress.current > totalSteps / stepsPerBatch) {
      state.progress.current = 0;
      await onProgress(state.progress.total / totalSteps);
    }
  };
};

@Injectable()
export class ExportsService {
  private deleteTimeouts: { [hash: string]: Timeout } = {};
  constructor(
    private documentService: DocumentService,
    private subscriptionsService: SubscriptionsService,
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
    await this.subscriptionsService.export.pending(document, userId);
    const nodes = await this.nodeService.getNodesMetaAndAHtml({
      documentId: document.id,
      userId,
    });
    const exportCTB = new ExportCTB({
      id: document.id,
      name: document.name,
      hash: document.hash,
      userId,
    });
    try {
      await this.subscriptionsService.export.preparing(document, userId);
      await exportCTB.createCtb();
      await exportCTB.createTables();
      const onNodeProgress = chunkify({
        totalSteps: nodes.length,
        stepsPerBatch: 10,
        onProgress: async progress => {
          await this.subscriptionsService.export.nodesStarted(
            document,
            userId,
            progress,
          );
        },
      });
      const imagesPerNode = await exportCTB.writeAHtmls(nodes, onNodeProgress);

      await exportCTB.writeBookmarks(document.state.bookmarks);

      const onImageProgress = chunkify({
        totalSteps: imagesPerNode.size,
        stepsPerBatch: 5,
        onProgress: async progress => {
          await this.subscriptionsService.export.imagesStarted(
            document,
            userId,
            progress,
          );
        },
      });

      await exportCTB.writeNodesImages({
        imagesPerNode,
        getNodeImages: this.imageService.getLoadedImages,
        onProgress: onImageProgress,
      });
      await this.subscriptionsService.export.finished(document, userId);
    } catch (e) {
      await this.subscriptionsService.export.failed(document, userId);
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
    try {
      await exportCTB.closeCtb();
      await this.scheduleDeletion(document, exportCTB);
      return exportCTB.getFileLocation.relativePath;
      // eslint-disable-next-line no-empty
    } catch {}
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
