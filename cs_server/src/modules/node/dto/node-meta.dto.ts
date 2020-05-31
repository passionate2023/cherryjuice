import { User } from '../../user/entities/user.entity';
import { NodeMetaIt } from './node-meta.it';

export class NodeMetaDto {
  user: User;
  node_id: number;
  documentId: string;
  meta: NodeMetaIt;
}
