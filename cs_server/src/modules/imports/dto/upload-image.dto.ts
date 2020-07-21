import { User } from '../../user/entities/user.entity';
import { UploadImageIt } from '../../node/it/upload-image.it';
import { Field } from '@nestjs/graphql';
import { FileUpload } from '../../document/helpers/graphql';
import { MutateNodeDTO } from '../../node/dto/mutate-node.dto';

export class UploadImageDto extends UploadImageIt {
  node_id: number;
  images: FileUpload[];
  @Field()
  user: User;
}
export class AddImageDTO extends MutateNodeDTO {
  images: FileUpload[];
}
