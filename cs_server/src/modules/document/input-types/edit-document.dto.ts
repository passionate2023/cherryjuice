import { User } from '../../user/entities/user.entity';
import { EditDocumentIt } from './edit-document.it';

export class EditDocumentDto {
  user: User;
  documentId: string;
  meta: EditDocumentIt;
}
