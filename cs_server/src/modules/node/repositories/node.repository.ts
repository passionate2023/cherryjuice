import { EntityRepository, Repository } from 'typeorm';
import { INodeRepository } from '../interfaces/node.repository';
import { Node } from '../entities/node.entity';
import { Injectable } from '@nestjs/common';
import { Image as CTBImage } from '../../document/helpers/copy-ctb/entities/Image';

@Injectable()
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
  }): Promise<
    Pick<
      CTBImage,
      'node_id' | 'offset' | 'justification' | 'anchor' | 'png' | 'link'
    >[]
  > {
    return Promise.resolve([]);
  }

  getNodeMetaById(node_id: number): Promise<Node[]> {
    return Promise.resolve([]);
  }

  getNodesMeta(): Promise<Node[]> {
    return Promise.resolve([]);
  }
}
