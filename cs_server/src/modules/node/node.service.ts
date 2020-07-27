import { aHtmlToHtml } from './helpers/rendering/ahtml-to-html';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';
import { NodeRepository } from './repositories/node.repository';
import {
  CreateNodeDTO,
  DeleteNodeDTO,
  GetNodeDTO,
  GetNodesDTO,
  MutateNodeContentDTO,
  MutateNodeMetaDTO,
} from './dto/mutate-node.dto';
import { ImageService } from '../image/image.service';
import { DocumentService } from '../document/document.service';
import { NodeSearchDto } from '../search/dto/node-search.dto';
import { NodeSearchResultEntity } from '../search/entities/node.search-result.entity';

@Injectable()
export class NodeService {
  constructor(
    private imageService: ImageService,
    private nodeRepository: NodeRepository,
    private documentService: DocumentService,
  ) {}

  async getNodes(dto: GetNodesDTO): Promise<Node[]> {
    return this.nodeRepository.getNodes(dto);
  }

  async getNodeById(dto: GetNodeDTO): Promise<Node> {
    return await this.nodeRepository.getNodeById(dto);
  }
  async getWNodeById(dto: GetNodeDTO): Promise<Node> {
    return await this.nodeRepository.getWNodeById(dto);
  }
  async getHtml(dto: GetNodeDTO): Promise<string> {
    const ahtml = await this.nodeRepository.getAHtml(dto);
    return aHtmlToHtml(ahtml);
  }
  async createNode(dto: CreateNodeDTO): Promise<Node> {
    const node = await this.nodeRepository.createNode(dto);
    await this.documentService.updateNodesHash({
      userId: dto.getNodeDTO.userId,
      documentId: dto.getNodeDTO.documentId,
      hash: node.hash,
      node_id: node.node_id,
    });
    return node;
  }
  async setAHtml(dto: MutateNodeContentDTO): Promise<string> {
    if (dto.data.deletedImages.length)
      await this.imageService.deleteImages(dto.data.deletedImages);
    const node = await this.nodeRepository.setAHtml(dto);
    await this.documentService.updateNodesHash({
      documentId: dto.getNodeDTO.documentId,
      node_id: node.node_id,
      hash: node.hash,
      userId: dto.getNodeDTO.userId,
    });
    return node.id;
  }
  async editMeta(dto: MutateNodeMetaDTO): Promise<string> {
    const node = await this.nodeRepository.setMeta(dto);
    await this.documentService.updateNodesHash({
      documentId: dto.getNodeDTO.documentId,
      node_id: node.node_id,
      hash: node.hash,
      userId: dto.getNodeDTO.userId,
    });
    return node.id;
  }

  async deleteNode(dto: DeleteNodeDTO): Promise<string> {
    const res = await this.nodeRepository.deleteNode(dto);
    await this.documentService.deleteNodesHash({
      userId: dto.getNodeDTO.userId,
      node_id: dto.getNodeDTO.node_id,
      documentId: dto.getNodeDTO.documentId,
    });
    return res;
  }
  async getNodesMetaAndAHtml(dto: GetNodesDTO): Promise<Node[]> {
    return await this.nodeRepository.getNodesMetaAndAHtml(dto);
  }

  async findNode(searchDto: NodeSearchDto): Promise<NodeSearchResultEntity[]> {
    return await this.nodeRepository.findNodes(searchDto);
  }
}
