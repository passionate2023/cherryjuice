import { EntityRepository, Repository } from 'typeorm';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import { SaveAhtmlDto } from '../dto/save-ahtml.dto';
import { NodeMetaDto } from '../dto/node-meta.dto';
import { CreateNodeDto } from '../dto/create-node.dto';
import { copyProperties } from '../../document/helpers';
import { DeleteNodeDto } from '../dto/delete-node.dto';

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

  async getNodeMetaById(
    node_id: string | number,
    documentId: string,
  ): Promise<Node> {
    return this.findOneOrFail({
      where: {
        node_id,
        documentId,
      },
    });
    // return await this.createQueryBuilder('node')
    //   .where('node.node_id = :node_id', { node_id })
    //   .andWhere('node.documentId = :documentId', { documentId })
    //   .getOne()
    //   .then(node => node? node  || new NotF);
  }

  async getNodesMeta(documentId: string): Promise<Node[]> {
    return await this.createQueryBuilder('node')
      .where('node.documentId = :documentId', { documentId })
      .getMany();
  }

  async saveAHtml({
    user,
    ahtml,
    node_id,
    documentId,
  }: SaveAhtmlDto): Promise<string> {
    const res = await this.createQueryBuilder('node')
      .update()
      .set({ ahtml })
      .where({ node_id, userId: user.id, documentId })
      .execute();
    return JSON.stringify(res);
  }

  async setMeta({ user, documentId, node_id, meta }: NodeMetaDto) {
    const res = await this.createQueryBuilder('node')
      .update()
      .set(meta)
      .where({ node_id, userId: user.id, documentId })
      .execute();

    if (meta.father_id) {
      const parentNode = await this.getNodeMetaById(meta.father_id, documentId);
      const node = await this.getNodeMetaById(node_id, documentId);
      node.father = parentNode;
      await node.save();
    }

    return JSON.stringify(res);
  }

  async createNode({ meta, documentId }: CreateNodeDto) {
    const node = new Node();
    copyProperties(meta, node, {});
    node.documentId = documentId;

    const parentNode = await this.getNodeMetaById(node.father_id, documentId);
    parentNode.child_nodes.splice(meta.position, 0, node.node_id);
    node.father = parentNode;

    await parentNode.save();
    await node.save();
    return node.id;
  }

  async deleteNode({
    documentId,
    node_id,
    user,
  }: DeleteNodeDto): Promise<string> {
    return await this.createQueryBuilder('node')
      .delete()
      .where({ node_id, userId: user.id, documentId })
      .execute()
      .then(res => JSON.stringify(res));
  }
}
