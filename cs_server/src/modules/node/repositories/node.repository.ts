import { EntityRepository, Repository } from 'typeorm';
import { INodeRepository } from '../interfaces/node.repository';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import { SaveAhtmlDto } from '../dto/save-ahtml.dto';

@Injectable()
@EntityRepository(Node)
export class NodeRepository extends Repository<Node>
  implements INodeRepository {
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

  async getNodeMetaById(node_id: string, documentId: string): Promise<Node[]> {
    return [
      await this.createQueryBuilder('node')
        .where('node.node_id = :node_id', { node_id })
        .andWhere('node.documentId = :documentId', { documentId })
        .getOne(),
    ];
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
}
