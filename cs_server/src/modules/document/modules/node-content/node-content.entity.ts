import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NodeContent {
  @Field(() => Int)
  node_id: number;

  @Field()
  html: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  png_thumbnail;

  @Field(() => [String], { nullable: 'itemsAndList' })
  png;
}
