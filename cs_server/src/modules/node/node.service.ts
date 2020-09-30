import { aHtmlToHtml } from './helpers/rendering/ahtml-to-html';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { PrivateNode } from './entities/private-node.ot';
import { Image } from '../image/entities/image.entity';
import { NodeDatesMap } from '../imports/helpers/import-ctb/import-ctb';
import { Document } from '../document/entities/document.entity';

@Injectable()
export class NodeService {
  constructor(
    private imageService: ImageService,
    private nodeRepository: NodeRepository,
    @Inject(forwardRef(() => DocumentService))
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
  async createNode(dto: CreateNodeDTO, updateHash = true): Promise<Node> {
    const node = await this.nodeRepository.createNode(dto);
    if (updateHash)
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

  async getPrivateNodes(dto: GetNodesDTO): Promise<PrivateNode[]> {
    return await this.nodeRepository.getPrivateNodes(dto);
  }

  clone = async (
    documentB: Document,
    allNodesA: Map<number, Node>,
    nodesA: Node[],
  ): Promise<void> => {
    const nodesB = new Map<number, Node>();
    const imageABIds = new Map<number, [string, string][]>();
    const nodesADates: NodeDatesMap = new Map();
    for await (const nodeA of nodesA) {
      const nodeB = await this.createNode(
        {
          data: {
            ...nodeA,
            createdAt: new Date(nodeA.createdAt).getTime(),
            updatedAt: new Date(nodeA.updatedAt).getTime(),
          },
          getNodeDTO: {
            userId: documentB.userId,
            documentId: documentB.id,
            node_id: nodeA.node_id,
          },
        },
        false,
      );

      const imagesA = await this.imageService.getNodeImagesAndThumbnails({
        nodeId: nodeA.id,
      });
      for await (const { image, thumbnail, hash, id } of imagesA) {
        const imageB = new Image();
        imageB.image = image;
        imageB.thumbnail = thumbnail;
        imageB.nodeId = nodeB.id;
        imageB.documentId = nodeB.documentId;
        imageB.hash = hash;
        await imageB.save();
        if (!imageABIds.has(nodeB.node_id)) imageABIds.set(nodeB.node_id, []);
        imageABIds.get(nodeB.node_id).push([id, imageB.id]);
      }
      nodesB.set(nodeB.node_id, nodeB);
      nodesADates.set(nodeA.node_id, {
        createdAt: new Date(nodeA.createdAt),
        updatedAt: new Date(nodeA.updatedAt),
      });
    }

    for await (const nodeB of nodesB.values()) {
      nodeB.child_nodes = nodeB.child_nodes.filter(node_id =>
        allNodesA.has(+node_id),
      );
      const father = nodesB.get(nodeB.father_id);
      if (father) {
        nodeB.father = father;
      }
      if (imageABIds.has(nodeB.node_id)) {
        imageABIds.get(nodeB.node_id).forEach(([a, b]) => {
          nodeB.ahtml = nodeB.ahtml.replace(a, b);
        });
      }
      nodeB.updateAhtmlTxt();
      nodeB.createdAt = nodesADates.get(nodeB.node_id).createdAt;
      nodeB.updatedAt = nodesADates.get(nodeB.node_id).updatedAt;
      documentB.nodes[nodeB.node_id] = { hash: nodeB.hash };
      await nodeB.save();
    }
  };
}
