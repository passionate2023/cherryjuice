import { Node } from '../entities/node.entity';

export interface INodeService {
  getHtml(node_id: string): Promise<string>;

  getNodesMeta(): Promise<Node[]>;

  getNodeMetaById(node_id: number): Promise<Node[]>;
}
