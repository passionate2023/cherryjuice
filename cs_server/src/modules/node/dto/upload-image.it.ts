import { FileUpload, GraphQLUpload } from '../../document/helpers/graphql';
import { Field, InputType, Int } from '@nestjs/graphql';
@InputType()
export class UploadImageIt {
  @Field(() => Int)
  node_id: number;
  @Field(() => [GraphQLUpload(['application/x-sqlite3'], 'ImageUpload')])
  images: FileUpload[];
  @Field()
  documentId: string;
}
