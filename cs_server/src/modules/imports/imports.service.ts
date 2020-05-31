import imageThumbnail from 'image-thumbnail';
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
import fs from 'fs';
import { ImageService } from '../image/image.service';
import { Node } from '../node/entities/node.entity';
import { NodeSqliteRepository } from '../node/repositories/node.sqlite.repository';
import { DocumentSqliteRepository } from '../document/repositories/document.sqlite.repository';
import { DocumentService } from '../document/document.service';
import {
  copyProperties,
  nodeTitleHelpers,
  nodeTitleStyle,
} from '../document/helpers';
import { Document } from '../document/entities/document.entity';
import { FileUpload } from '../document/helpers/graphql';
import { Image } from '../image/entities/image.entity';
import { ImageSqliteRepository } from '../image/repositories/image.sqlite.repository';
import { importThreshold } from './helpers/thresholds';
import { UploadImageDto } from './dto/upload-image.dto';
import { NodeService } from '../node/node.service';
export type DocumentDTO = {
  name: string;
  size: number;
  user: User;
  // id: string;
};
type ImageIdsMap = { [tempId: string]: string };

@Injectable()
export class ImportsService {
  constructor(
    private documentService: DocumentService,
    private imageService: ImageService,
    private nodeService: NodeService,
    private documentSqliteRepository: DocumentSqliteRepository,
    private nodeSqliteRepository: NodeSqliteRepository,
    private imageSqliteRepository: ImageSqliteRepository,
  ) {}

  onModuleInit(): void {
    cleanUploadsFolder();
  }

  async openUploadedFile(filePath: string): Promise<void> {
    await this.documentSqliteRepository.openUploadedFile(filePath);
  }
  async closeUploadedFile(): Promise<void> {
    await this.documentSqliteRepository.closeUploadedFile();
  }

  async functiona(
    newDocument: Document,
    rawNodes: (Node & { is_ro; has_image })[],
  ) {
    const nodesWithImages: Node[] = [];
    const nodesMap = new Map<number, Node>();
    const rawNodesMap: Map<number, Node> = new Map(
      rawNodes.map(node => [node.node_id, node]),
    );

    for (const nodeRaw of rawNodes) {
      const parentNode = rawNodesMap.get(nodeRaw.father_id);
      if (parentNode) {
        parentNode.child_nodes.push(nodeRaw.node_id);
      }
      nodeRaw.node_title_styles = nodeTitleStyle({
        is_richtxt: nodeRaw.is_richtxt,
      });
      nodeRaw.icon_id = '' + nodeTitleHelpers.customIconId(nodeRaw.is_ro);

      const node = new Node();
      copyProperties(nodeRaw, node, {});
      node.document = newDocument;
      nodesMap.set(node.node_id, node);
      await node.save();
      if (nodeRaw.has_image) nodesWithImages.push(node);
    }

    for (const node of Array.from(nodesMap.values())) {
      node.child_nodes.sort(
        // @ts-ignore
        (a, b) => rawNodesMap.get(a).sequence - rawNodesMap.get(b).sequence,
      );
      const father = nodesMap.get(node.father_id);
      if (father) node.father = father;
    }
    return { nodesWithImages, nodesMap };
  }

  private async saveNodes(
    newDocument: Document,
  ): Promise<{ nodesWithImages: Node[]; nodesMap: Map<number, Node> }> {
    const rawNodes = (await this.nodeSqliteRepository.getNodesMeta(
      false,
    )) as (Node & { is_ro; has_image })[];
    const { nodesWithImages, nodesMap } = await this.functiona(
      newDocument,
      rawNodes,
    );
    return { nodesWithImages, nodesMap };
  }
  private async saveDocument({
    document,
    hash,
  }: {
    document: Document;
    hash: string;
  }): Promise<void> {
    const filePath = '/uploads/' + document.name;
    await this.openUploadedFile(filePath);
    const { nodesWithImages, nodesMap } = await this.saveNodes(document);
    const { imagesOfNodes } = await this.saveImages(nodesWithImages);
    await this.saveAhtml({ imagesOfNodes, nodesMap });
    const { size } = fs.statSync(filePath);
    document.size = size;
    document.hash = hash;
    await document.save();
  }
  async saveImages(
    nodes: Node[],
  ): Promise<{ imagesOfNodes: Map<number, Image[]> }> {
    const imagesOfNodes: Map<number, Image[]> = new Map();
    for (const node of nodes) {
      const images = await this.imageSqliteRepository.getNodeImages({
        node_id: node.node_id,
      });
      imagesOfNodes.set(node.node_id, []);
      for (const { png } of images) {
        if (png) {
          const image = new Image();
          image.image = png;
          image.thumbnail = await imageThumbnail(png, {
            percentage: 5,
          });
          image.nodeId = node.id;
          await image.save();
          imagesOfNodes.get(node.node_id).push(image);
        }
      }
    }
    return { imagesOfNodes };
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
    const imageIDs: [string, string][] = [];
    for (const file of images) {
      const { createReadStream, filename } = await file;
      const chunksContainer = { current: [] };
      const { hash } = await download(
        { readStream: createReadStream(), chunksContainer },
        () => Promise.resolve(),
      );
      const buffer = Buffer.concat(chunksContainer.current);
      const image = new Image();
      image.image = buffer;
      image.thumbnail = await imageThumbnail(buffer, {
        percentage: 5,
      });
      const node = await this.nodeService.getNodeMetaById({
        documentId,
        node_id,
        user,
      });
      image.nodeId = node.id;
      image.hash = hash;
      await image.save();
      imageIDs.push([filename, image.id]);
    }
    return imageIDs;
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
        await importThreshold.pending(document);
      } catch (e) {
        await importThreshold.failed(document);
        throw e;
      }
    }
    for (const { document, downloadTask } of documents) {
      try {
        await importThreshold.preparing(document);
        const { hash } = await download(downloadTask, document.reload);
        const documentWithSameHash = await this.documentService.findDocumentByHash(
          hash,
          user,
        );
        if (documentWithSameHash) {
          await importThreshold.duplicate(document);
          await this.documentService.deleteDocuments([document.id], user, {
            notifySubscribers: false,
          });
        } else {
          await importThreshold.started(document);
          await this.saveDocument({
            document,
            hash,
          });
          await importThreshold.finished(document);
        }
      } catch (e) {
        await importThreshold.failed(document);
        throw e;
      }
      await this.closeUploadedFile();
    }
    cleanUploadsFolder();
  }

  private async saveAhtml({
    nodesMap,
    imagesOfNodes,
  }: {
    nodesMap: Map<number, Node>;
    imagesOfNodes: Map<number, Image[]>;
  }) {
    for (const node of Array.from(nodesMap.values())) {
      node.ahtml = JSON.stringify(
        await this.nodeSqliteRepository.getAHtml(
          String(node.node_id),
          imagesOfNodes.get(node.node_id),
        ),
      );
      await node.save();
    }
  }
}
