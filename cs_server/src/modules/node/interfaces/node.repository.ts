import { Node } from '../entities/node.entity';
import { Image as CTBImage } from '../../document/helpers/copy-ctb/entities/Image';

export interface INodeRepository {
  getNodeImages({
    node_id,
    offset,
  }): Promise<
    Pick<
      CTBImage,
      'node_id' | 'offset' | 'justification' | 'anchor' | 'png' | 'link'
    >[]
  >;

  getAHtml(node_id: string): Promise<{ nodes: any; styles: any }[]>;

  getNodesMeta(): Promise<Node[]>;

  getNodeMetaById(node_id: number): Promise<Node[]>;
}
