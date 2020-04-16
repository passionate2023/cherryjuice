import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Node {
  @Field(() => Int)
  node_id: number;

  @Field()
  name: string;

  @Field(() => Int)
  father_id: number;

  @Field(() => [Int])
  child_nodes: number[];

  @Field(() => Int)
  is_empty: number;

  @Field(() => Int)
  is_richtxt: number;

  @Field(() => Int)
  has_image: number;

  @Field(() => Int)
  has_codebox: number;

  @Field(() => Int)
  has_table: number;

  @Field(() => Float)
  ts_creation: number;

  @Field(() => Float)
  ts_lastsave: number;

  @Field()
  node_title_styles: string;

  @Field()
  icon_id: string;

  @Field()
  html: string;

  @Field(() => [String], { nullable: 'items' })
  image: string[];
}
