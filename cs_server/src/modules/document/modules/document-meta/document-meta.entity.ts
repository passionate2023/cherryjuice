import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentMeta {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  size: number;

  @Field(() => Float)
  createdAt: number;

  @Field(() => Float)
  updatedAt: number;

  @Field({ nullable: true })
  folder: string;
}
