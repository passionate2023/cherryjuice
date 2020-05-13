import { User } from '../../user/entities/user.entity';

export class DeleteNodeDto {
  user: User;
  node_id: string;
  documentId: string;
}
