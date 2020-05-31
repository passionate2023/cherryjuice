import { User } from '../../user/entities/user.entity';
import { UploadImageIt } from '../../node/dto/upload-image.it';
import { Field } from '@nestjs/graphql';
import { FileUpload } from '../../document/helpers/graphql';

export class UploadImageDto extends UploadImageIt {
  node_id: number;
  images: FileUpload[];
  @Field()
  user: User;
}
