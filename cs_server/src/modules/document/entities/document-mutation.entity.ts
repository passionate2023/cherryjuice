import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentMutation {
  @Field()
  uploadFile: boolean;

  @Field()
  uploadLink: boolean;

  @Field()
  deleteDocument: string;
}
