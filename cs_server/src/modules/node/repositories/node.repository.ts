import { EntityRepository, Repository } from 'typeorm';
import { INodeRepository } from '../interfaces/node.repository';
import { Node } from '../entities/node.entity';
import { Image } from '../../image/entities/image.entity';

@EntityRepository(Node)
export class NodeRepository extends Repository<Node>
  implements INodeRepository {
  getAHtml(node_id: string): Promise<{ nodes: any; styles: any }[]> {
    return Promise.resolve([]);
  }

  getNodeImages({
    node_id,
    offset,
  }: {
    node_id: any;
    offset: any;
  }): Promise<Image[]> {
    return Promise.resolve([]);
  }

  getNodeMetaById(node_id: number): Promise<Node[]> {
    return Promise.resolve([]);
  }

  getNodesMeta(): Promise<Node[]> {
    return Promise.resolve([]);
  }
}
