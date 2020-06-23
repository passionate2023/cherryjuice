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
import { DeleteNodeDto } from './dto/delete-node.dto';
import { GetNodeByNodeIdIt } from './dto/get-node-by-node-id.it';
import { DocumentService } from '../document/document.service';

@Injectable()
export class NodeService {
  constructor(
    private imageService: ImageService,
    private nodeRepository: NodeRepository,
    private documentService: DocumentService,
    private nodeSqliteRepository: NodeSqliteRepository,
  ) {}

  async createNode(args: CreateNodeDto): Promise<string> {
    const node = await this.nodeRepository.createNode(args);
    await this.documentService.updateNodesHash({ ...args, ...node });
    return node.id;
  }
  async setAHtml(args: SaveAhtmlDto): Promise<string> {
    if (args.data.deletedImages.length)
      await this.imageService.deleteImages(args.data.deletedImages);
    const node = await this.nodeRepository.setAHtml(args);
    await this.documentService.updateNodesHash({ ...args, ...node });
    return node.id;
  }

  async setMeta(args: NodeMetaDto): Promise<string> {
    const node = await this.nodeRepository.setMeta(args);
    await this.documentService.updateNodesHash({ ...args, ...node });
    return node.id;
  }

  async deleteNode(args: DeleteNodeDto): Promise<string> {
    const res = await this.nodeRepository.deleteNode(args);
    await this.documentService.deleteNodesHash({
      ...args,
      node_id: args.node_id,
    });
    return res;
  }

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

  async getNodeMetaById(args: GetNodeByNodeIdIt): Promise<Node> {
    if (debug.loadSqliteDocuments)
      return this.nodeSqliteRepository.getNodeMetaById(args.node_id);
    return await this.nodeRepository.getNodeMetaById(args);
  }

  async getNodesMetaAndAHtml(documentId: string): Promise<Node[]> {
    if (debug.loadSqliteDocuments)
      return this.nodeSqliteRepository.getNodesMeta(true);
    return await this.nodeRepository.getNodesMetaAndAHtml(documentId);
  }
}
