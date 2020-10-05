import { User } from '../../user/entities/user.entity';

export class ExportDocumentDto {
  user: User;
  documentId: string;
}
