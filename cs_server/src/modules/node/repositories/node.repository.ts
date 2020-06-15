import { EntityRepository, Repository } from 'typeorm';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import { SaveAhtmlDto } from '../dto/save-ahtml.dto';
import { NodeMetaDto } from '../dto/node-meta.dto';
import { CreateNodeDto } from '../dto/create-node.dto';
import { copyProperties } from '../../document/helpers';
import { DeleteNodeDto } from '../dto/delete-node.dto';
import { GetNodeByNodeIdIt } from '../dto/get-node-by-node-id.it';

@Injectable()
@EntityRepository(Node)
export class NodeRepository extends Repository<Node> {
  getAHtml(
    node_id: string,
    documentId: string,
  ): Promise<{ nodes: any; style: any }[]> {
    return this.createQueryBuilder('node')
      .select('node.ahtml')
      .where('node.documentId = :documentId', { documentId })
      .andWhere('node.node_id = :node_id', { node_id })
      .getOne()
      .then(node => JSON.parse(node.ahtml));
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

  async getNodesMeta(documentId: string): Promise<Node[]> {
    return await this.createQueryBuilder('node')
      .where('node.documentId = :documentId', { documentId })
      .getMany();
  }

  async saveAHtml({
    data: { ahtml, updatedAt },
    node_id,
    documentId,
  }: SaveAhtmlDto): Promise<string> {
    const res = await this.createQueryBuilder('node')
      .update()
      .set({ ahtml, updatedAt: new Date(updatedAt) })
      .where({ node_id, documentId })
      .execute();
    return JSON.stringify(res);
  }

  async setMeta({ documentId, node_id, meta }: NodeMetaDto) {
    const res = await this.createQueryBuilder('node')
      .update()
      .set({ ...meta, updatedAt: new Date(meta.updatedAt) })
      .where({ node_id, documentId })
      .execute();

    return JSON.stringify(res);
  }

  async createNode({ meta, documentId, user }: CreateNodeDto) {
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
    await node.save();

    return node.id;
  }

  async deleteNode({ documentId, node_id }: DeleteNodeDto): Promise<string> {
    return await this.createQueryBuilder('node')
      .delete()
      .where({ node_id, documentId })
      .execute()
      .then(res => JSON.stringify(res));
  }
}
