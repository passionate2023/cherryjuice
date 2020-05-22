import { User } from '../../user/entities/user.entity';
import { CreateNodeIt } from './create-node.it';

export class CreateNodeDto {
  user: User;
  node_id: number;
  documentId: string;
  meta: CreateNodeIt;
}
