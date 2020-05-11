import { User } from '../../user/entities/user.entity';
import { CreateNodeIt } from './create-node.it';

export class CreateNodeDto {
  user: User;
  node_id: string;
  documentId: string;
  meta: CreateNodeIt;
}
