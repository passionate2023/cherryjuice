import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentMeta {
  @Field()
  name: string;

  @Field(() => Int)
  size: number;

  @Field(() => Float)
  fileCreation: number;

  @Field(() => Float)
  fileContentModification: number;

  @Field(() => Float)
  fileAttributesModification: number;

  @Field(() => Float)
  fileAccess: number;

  @Field()
  slug: string;

  @Field()
  id: string;

  @Field()
  filePath: string;

  @Field()
  fileFolder: string;
}
