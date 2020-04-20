import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentUpload {
  @Field()
  upload: boolean;
}