import imageThumbnail from 'image-thumbnail';
import { Injectable } from '@nestjs/common';
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
import { Image } from '../image/entities/image.entity';
import { ImageSqliteRepository } from '../image/repositories/image.sqlite.repository';
import { NodeService } from '../node/node.service';
import { User } from '../user/entities/user.entity';

type NodeDateMap = Map<number, { createdAt: Date; updatedAt: Date }>;
type NodeDatesMap = NodeDateMap;
type NodeNode_idMap = Map<number, Node>;

const sortBySequence = rawNodesMap => (a, b) =>
  rawNodesMap.get(a).sequence - rawNodesMap.get(b).sequence;

type NodeImagesMap = [Node, { png: Buffer; hash?: string }[]][];

type Node_idImagesMap = Map<number, string[]>;

@Injectable()
export class SaveDocumentsService {
  constructor(
    private documentService: DocumentService,
    private imageService: ImageService,
    private nodeService: NodeService,
    private documentSqliteRepository: DocumentSqliteRepository,
    private nodeSqliteRepository: NodeSqliteRepository,
    private imageSqliteRepository: ImageSqliteRepository,
  ) {}

  async saveDocument({
    user,
    document,
    rawNodes,
  }: {
    user: User;
    document: Document;
    rawNodes: (Node & { is_ro; has_image })[];
  }): Promise<void> {
    const { nodeImagesMap, nodesMap, nodeDatesMap } = await this.saveNodesMeta(
      document,
      rawNodes,
    );
    const { node_idImagesMap } = await this.saveImages(nodeImagesMap);
    await this.saveAhtml({
      node_idImagesMap,
      nodesMap,
      nodeDatesMap,
      document,
    });
    document.size = await this.documentService.getSize({
      documentId: document.id,
      user,
    });
    await document.save();
  }

  async saveNodesMeta(
    newDocument: Document,
    rawNodes: (Node & { is_ro; has_image })[],
  ): Promise<{
    nodesMap: NodeNode_idMap;
    nodeImagesMap: NodeImagesMap;
    nodeDatesMap: NodeDateMap;
  }> {
    const nodeImagesMap: NodeImagesMap = [];
    const nodesMap = new Map<number, Node>();
    const nodeDatesMap: NodeDatesMap = new Map();
    const rawNodesMap: NodeNode_idMap = new Map(
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
      copyProperties(nodeRaw, node, { createdAt: true, updatedAt: true });
      node.document = newDocument;
      nodesMap.set(node.node_id, node);
      await node.save();
      nodeDatesMap.set(node.node_id, {
        createdAt: new Date(nodeRaw.createdAt),
        updatedAt: new Date(nodeRaw.updatedAt),
      });
      if (nodeRaw.has_image) {
        const images = await this.imageSqliteRepository.getNodeImages({
          node_id: node.node_id,
        });
        nodeImagesMap.push([node, images]);
      }
    }

    const sortBySequence1 = sortBySequence(rawNodesMap);
    for (const node of Array.from(nodesMap.values())) {
      node.child_nodes.sort(sortBySequence1);
      const father = nodesMap.get(node.father_id);
      if (father) node.father = father;
    }
    return { nodeImagesMap, nodesMap, nodeDatesMap };
  }

  async saveImages(
    nodeImagesMap: NodeImagesMap,
  ): Promise<{ node_idImagesMap: Node_idImagesMap }> {
    const node_idImagesMap: Node_idImagesMap = new Map();
    for (const [node, images] of nodeImagesMap) {
      const imageIds = [];
      for (const { png, hash } of images) {
        if (png) {
          const image = new Image();
          image.image = png;
          image.thumbnail = await imageThumbnail(png, {
            percentage: 5,
          });
          image.nodeId = node.id;
          image.documentId = node.documentId;
          image.hash = hash;
          await image.save();
          imageIds.push(image.id);
        }
      }
      node_idImagesMap.set(node.node_id, imageIds);
    }
    return { node_idImagesMap };
  }

  private async saveAhtml({
    nodesMap,
    node_idImagesMap,
    nodeDatesMap,
    document,
  }: {
    nodesMap: NodeNode_idMap;
    node_idImagesMap: Node_idImagesMap;
    nodeDatesMap: NodeDatesMap;
    document: Document;
  }) {
    for (const node of Array.from(nodesMap.values())) {
      node.ahtml = JSON.stringify(
        await this.nodeSqliteRepository.getAHtml(
          String(node.node_id),
          node_idImagesMap.get(node.node_id),
        ),
      );
      node.createdAt = nodeDatesMap.get(node.node_id).createdAt;
      node.updatedAt = nodeDatesMap.get(node.node_id).updatedAt;
      node.updateSha();
      document.nodes[node.node_id] = { hash: node.hash };
      await node.save();
    }
  }
}