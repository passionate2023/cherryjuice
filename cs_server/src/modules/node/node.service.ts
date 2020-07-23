import { aHtmlToHtml } from './helpers/rendering/ahtml-to-html';
import { Injectable } from '@nestjs/common';
import { Node } from './entities/node.entity';
import { NodeRepository } from './repositories/node.repository';
import {
  CreateNodeDTO,
  GetNodeDTO,
  GetNodesDTO,
  MutateNodeContentDTO,
  MutateNodeMetaDTO,
} from './dto/mutate-node.dto';
import { ImageService } from '../image/image.service';
import { DocumentService } from '../document/document.service';
import { NodeSearchDto } from '../search/dto/node-search.dto';
import { NodeSearchResultEntity } from '../search/entities/node.search-result.entity';
import { NodeOwnerRepository } from './repositories/node.owner.repository';
import { OwnershipLevel } from '../document/entities/document.owner.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class NodeService {
  constructor(
    private imageService: ImageService,
    private nodeRepository: NodeRepository,
    private documentService: DocumentService,
    private ownershipService: NodeOwnerRepository,
    private nodeOwnerRepository: NodeOwnerRepository,
  ) {}

  async getNodes(dto: GetNodesDTO): Promise<Node[]> {
    return this.nodeRepository.getNodes(dto);
  }

  async getNodeById(dto: GetNodeDTO): Promise<Node> {
    return await this.nodeRepository.getNodeById(dto);
  }

  async getHtml(dto: GetNodeDTO): Promise<string> {
    const ahtml = await this.nodeRepository.getAHtml(dto);
    return aHtmlToHtml(ahtml);
  }
  async createNode(dto: CreateNodeDTO, user: User): Promise<Node> {
    const node = await this.nodeRepository.createNode(dto);
    const document = await this.documentService.updateNodesHash({
      ownership: OwnershipLevel.WRITER,
      userId: dto.getNodeDTO.userId,
      documentId: dto.getNodeDTO.documentId,
      hash: node.hash,
      node_id: node.node_id,
    });
    const { public: isPublic } = dto.data.owner;
    await this.nodeOwnerRepository.createOwnership({
      documentId: document.id,
      userId: user.id,
      isPublic,
      ownershipLevel: OwnershipLevel.OWNER,
      nodeId: node.id,
      node_id: node.node_id,
    });
    return node;
  }
  async setAHtml(args: MutateNodeContentDTO): Promise<string> {
    if (args.data.deletedImages.length)
      await this.imageService.deleteImages(args.data.deletedImages);
    const node = await this.nodeRepository.setAHtml(args);
    await this.documentService.updateNodesHash({
      documentId: args.getNodeDTO.documentId,
      node_id: node.node_id,
      hash: node.hash,
      userId: args.getNodeDTO.userId,
      ownership: OwnershipLevel.WRITER,
    });
    return node.id;
  }
  async editMeta(dto: MutateNodeMetaDTO): Promise<string> {
    if (typeof dto.data?.owner?.public === 'boolean') {
      await this.nodeOwnerRepository.updateOwnership(dto);
      delete dto.data.owner;
    }
    const node = await this.nodeRepository.setMeta(dto);
    await this.documentService.updateNodesHash({
      documentId: dto.getNodeDTO.documentId,
      node_id: node.node_id,
      hash: node.hash,
      userId: dto.getNodeDTO.userId,
      ownership: OwnershipLevel.WRITER,
    });
    return node.id;
  }

  async deleteNode(dto: GetNodeDTO): Promise<string> {
    const res = await this.nodeRepository.deleteNode(dto);
    await this.documentService.deleteNodesHash(dto);
    return res;
  }
  async getNodesMetaAndAHtml(dto: GetNodesDTO): Promise<Node[]> {
    return await this.nodeRepository.getNodesMetaAndAHtml(dto);
  }

  async findNode(searchDto: NodeSearchDto): Promise<NodeSearchResultEntity[]> {
    return await this.nodeRepository.findNodes(searchDto);
  }
}
