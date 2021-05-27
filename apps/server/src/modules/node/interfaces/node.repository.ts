import { Node } from '../entities/node.entity';
export interface INodeRepository {
  getAHtml(
    node_id: string,
    documentID: string,
  ): Promise<{ nodes: any; style: any }[]>;

  getNodesMeta(documentId: string): Promise<Node[]>;

  getNodeMetaById(node_id: string, documentID: string): Promise<Node[]>;
}
