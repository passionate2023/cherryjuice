import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentUpload {
  @Field()
  uploadFile: boolean;

  @Field()
  uploadLink: boolean;
}
