import { EntityRepository, Repository } from 'typeorm';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import { SaveAhtmlDto } from '../dto/save-ahtml.dto';
import { NodeMetaDto } from '../dto/node-meta.dto';
import { CreateNodeDto } from '../dto/create-node.dto';
import { copyProperties } from '../../document/helpers';
import { DeleteNodeDto } from '../dto/delete-node.dto';
import { GetNodeByNodeIdIt } from '../dto/get-node-by-node-id.it';
import { SaveHtmlIt } from '../dto/save-html.it';
import { NodeMetaIt } from '../dto/node-meta.it';
import { AHtml } from '../helpers/rendering/query/ahtml-to-html';

@Injectable()
@EntityRepository(Node)
export class NodeRepository extends Repository<Node> {
  async createNode({ meta, documentId, user }: CreateNodeDto): Promise<Node> {
    const node = new Node();
    copyProperties(meta, node, {});
    node.documentId = documentId;
    node.createdAt = new Date(meta.createdAt);
    node.updatedAt = new Date(meta.updatedAt);
    if (node.father_id !== -1) {
      node.father = await this.getNodeMetaById({
        node_id: node.father_id,
        documentId,
        user,
      });
    }
    await this.save(node);
    return node;
  }

  getAHtml(node_id: string, documentId: string): Promise<AHtml[]> {
    return this.createQueryBuilder('node')
      .select('node.ahtml')
      .where('node.documentId = :documentId', { documentId })
      .andWhere('node.node_id = :node_id', { node_id })
      .getOne()
      .then(node => JSON.parse(node.ahtml));
  }

  async getNodesMeta(documentId: string): Promise<Node[]> {
    return await this.createQueryBuilder('node')
      .where('node.documentId = :documentId', { documentId })
      .getMany();
  }

  async getNodeMetaById({
    documentId,
    node_id,
  }: GetNodeByNodeIdIt): Promise<Node> {
    return this.findOneOrFail({
      where: {
        node_id,
        documentId,
      },
    });
  }

  private async updateNode({
    attributes,
    node_id,
    documentId,
  }: {
    node_id: number;
    documentId: string;
    attributes: SaveHtmlIt | NodeMetaIt;
  }): Promise<Node> {
    const node = await this.findOneOrFail({ node_id, documentId });
    if (typeof attributes.updatedAt === 'number')
      attributes.updatedAt = (new Date(attributes.updatedAt) as unknown) as any;
    Object.entries(attributes).forEach(([k, v]) => {
      node[k] = v;
    });

    await this.save(node);
    return node;
  }

  async setAHtml({ data, node_id, documentId }: SaveAhtmlDto): Promise<Node> {
    const node = await this.updateNode({
      node_id,
      documentId,
      attributes: data,
    });
    return node;
  }

  async setMeta({ documentId, node_id, meta }: NodeMetaDto): Promise<Node> {
    const node = await this.updateNode({
      attributes: meta,
      node_id,
      documentId,
    });

    return node;
  }

  async deleteNode({ documentId, node_id }: DeleteNodeDto): Promise<string> {
    return await this.createQueryBuilder('node')
      .delete()
      .where({ node_id, documentId })
      .execute()
      .then(res => JSON.stringify(res));
  }
}
