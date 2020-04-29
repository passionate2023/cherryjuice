import imageThumbnail from 'image-thumbnail';
import { Injectable } from '@nestjs/common';
import { randomUUID10 } from '../shared';
import {
  createGDriveDownloadTask,
  createGqlDownloadTask,
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
import { copyProperties } from '../document/helpers';
import { Document } from '../document/entities/document.entity';
import { FileUpload } from '../document/helpers/graphql';
import { Image } from '../image/entities/image.entity';
import { ImageSqliteRepository } from '../image/repositories/image.sqlite.repository';
import { importThreshold } from './helpers/thresholds';
@Injectable()
export class ImportsService {
  constructor(
    private documentService: DocumentService,
    private imageService: ImageService,
    private documentSqliteRepository: DocumentSqliteRepository,
    private nodeSqliteRepository: NodeSqliteRepository,
    private imageSqliteRepository: ImageSqliteRepository,
  ) {}

  async openUploadedFile(filePath: string): Promise<void> {
    await this.documentSqliteRepository.openUploadedFile(filePath);
  }
  private async saveNodes(
    newDocument: Document,
  ): Promise<{ nodesWithImages: Node[] }> {
    const nodes = await this.nodeSqliteRepository.getNodesMeta();
    const nodesWithImages = [];
    for (const nodeToBeSaved of nodes) {
      nodeToBeSaved.ahtml = JSON.stringify(
        await this.nodeSqliteRepository.getAHtml(String(nodeToBeSaved.node_id)),
      );
      const node = new Node();
      copyProperties(nodeToBeSaved, node, {});
      node.document = newDocument;
      await node.save();
      if (node.has_image) nodesWithImages.push(node);
    }
    return { nodesWithImages };
  }
  private async saveDocument({
    document,
  }: {
    document: Document;
  }): Promise<void> {
    const filePath = '/uploads/' + document.name;
    await this.openUploadedFile(filePath);
    const { nodesWithImages } = await this.saveNodes(document);
    await this.saveImages(nodesWithImages);
    const { size } = fs.statSync(filePath);
    document.size = size;
    await document.save();
  }
  async saveImages(nodes: Node[]): Promise<void> {
    for (const node of nodes) {
      const images = await this.imageSqliteRepository.getNodeImages({
        node_id: node.node_id,
        offset: undefined,
      });
      for (const { png, offset } of images) {
        if (png) {
          const image = new Image();
          image.image = png;
          image.thumbnail = await imageThumbnail(png, {
            percentage: 5,
          });
          image.nodeId = node.id;
          image.offset = offset;
          await image.save();
        }
      }
    }
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

  async importDocument(
    meta: TDownloadTaskProps[],
    user: User,
    taskCreator: TDownloadTaskCreator,
  ): Promise<void> {
    const documents: { document: Document; download: any }[] = [];
    let document;
    for (const file of meta) {
      try {
        document = await this.documentService.createDocument({
          fileName: '',
          size: 0,
          user,
          id: randomUUID10(),
        });
        const download = await taskCreator(file);
        document.name = download.fileName;
        documents.push({ document, download });
        await importThreshold.preparing(document);
      } catch (e) {
        await importThreshold.failed(document);
        throw e;
      }
    }
    for (const { document, download } of documents) {
      try {
        await download.start();
        await importThreshold.started(document);
        await this.saveDocument({
          document,
        });
        await importThreshold.finished(document);
      } catch (e) {
        await importThreshold.failed(document);
        throw e;
      }
    }
  }
}
