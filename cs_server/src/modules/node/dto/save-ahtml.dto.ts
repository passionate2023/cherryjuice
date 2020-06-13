import { User } from '../../user/entities/user.entity';
import { SaveHtmlIt } from './save-html.it';

export class SaveAhtmlDto {
  user: User;
  node_id: number;
  documentId: string;
  data: SaveHtmlIt;
}
