import { Image } from '../../document/helpers/copy-ctb/entities/Image';
import { Node } from '../entities/node.entity';

export interface INodeRepository {
  getNodeImages({ node_id, offset }): Promise<Image[]>;

  getAHtml(node_id: string): Promise<{ nodes: any; styles: any }[]>;

  getNodesMeta(): Promise<Node[]>;

  getNodeMetaById(node_id: number): Promise<Node[]>;
}
