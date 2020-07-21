import { SaveHtmlIt } from '../it/save-html.it';
import { NodeMetaIt } from '../it/node-meta.it';
import { CreateNodeIt } from '../it/create-node.it';
import { GetDocumentDTO } from '../../document/document.service';

export type GetNodeDTO = GetDocumentDTO & {
  node_id: number;
  publicAccess?: boolean;
};
export type GetNodesDTO = Omit<GetNodeDTO, 'node_id'>;

export class MutateNodeDTO {
  getNodeDTO: GetNodeDTO;
}

export class MutateNodeContentDTO extends MutateNodeDTO {
  data: SaveHtmlIt;
}

export class MutateNodeMetaDTO extends MutateNodeDTO {
  data: NodeMetaIt;
}

export class CreateNodeDTO extends MutateNodeDTO {
  data: CreateNodeIt;
}
