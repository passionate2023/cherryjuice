import { aHtmlToHtml } from './helpers/rendering/query/ahtml-to-html';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';
import { NodeRepository } from './repositories/node.repository';
import { debug } from '../shared';
import { SaveAhtmlDto } from './dto/save-ahtml.dto';
import { ImageService } from '../image/image.service';
import { NodeMetaDto } from './dto/node-meta.dto';
import { CreateNodeDto } from './dto/create-node.dto';

@Injectable()
export class NodeService {
  constructor(
    private imageService: ImageService,
    private nodeRepository: NodeRepository,
    private nodeSqliteRepository: NodeSqliteRepository,
  ) {}

  async getHtml(node_id: string, documentId: string): Promise<string> {
    if (debug.loadSqliteDocuments) {
      const ahtml = await this.nodeSqliteRepository.getAHtml(node_id);
      return aHtmlToHtml(ahtml);
    }
    const ahtml = await this.nodeRepository.getAHtml(node_id, documentId);
    return aHtmlToHtml(ahtml);
  }

  async getNodesMeta(documentId: string): Promise<Node[]> {
    if (debug.loadSqliteDocuments)
      return this.nodeSqliteRepository.getNodesMeta();
    return this.nodeRepository.getNodesMeta(documentId);
  }

  async getNodeMetaById(node_id: string, documentId: string): Promise<Node[]> {
    if (debug.loadSqliteDocuments)
      return this.nodeSqliteRepository.getNodeMetaById(node_id);
    return this.nodeRepository.getNodeMetaById(node_id, documentId);
  }
  async saveAHtml(args: SaveAhtmlDto): Promise<string> {
    if (args.deletedImages.length)
      await this.imageService.deleteImages(args.deletedImages);
    return await this.nodeRepository.saveAHtml(args);
  }

  async setMeta(args: NodeMetaDto): Promise<string> {
    return await this.nodeRepository.setMeta(args);
  }
  async createNode(args: CreateNodeDto): Promise<string> {
    return await this.nodeRepository.createNode(args);
  }
}
