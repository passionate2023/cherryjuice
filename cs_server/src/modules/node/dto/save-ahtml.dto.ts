import { User } from '../../user/entities/user.entity';

export class SaveAhtmlDto {
  user: User;
  ahtml: string;
  node_id: number;
  documentId: string;
  deletedImages: string[];
}
