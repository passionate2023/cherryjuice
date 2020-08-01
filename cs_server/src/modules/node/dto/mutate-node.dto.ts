import { SaveHtmlIt } from '../it/save-html.it';
import { NodeMetaIt } from '../it/node-meta.it';
import { CreateNodeIt } from '../it/create-node.it';
import { GetDocumentDTO } from '../../document/dto/document.dto';

export type GetNodeDTO = Omit<GetDocumentDTO, 'minimumGuestAccessLevel'> & {
  node_id: number;
};
export type GetNodesDTO = Omit<GetNodeDTO, 'node_id'>;

export type MutateNodeDTO = {
  getNodeDTO: GetNodeDTO;
};
export type DeleteNodeDTO = MutateNodeDTO;
export type MutateNodeContentDTO = MutateNodeDTO & {
  data: SaveHtmlIt;
};

export type MutateNodeMetaDTO = MutateNodeDTO & {
  data: NodeMetaIt;
};

export type CreateNodeDTO = MutateNodeDTO & {
  data: CreateNodeIt;
};
