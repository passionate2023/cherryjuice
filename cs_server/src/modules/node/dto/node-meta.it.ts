import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NodeMetaIt {
  @Field({ nullable: true })
  father_id: number;

  @Field(() => [Int], { nullable: 'itemsAndList' })
  child_nodes: number[];

  @Field({ nullable: true }) sequence: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  node_title_styles: string;

  @Field(() => Int, { nullable: true })
  is_richtxt: number;

  @Field({ nullable: true })
  icon_id: string;

  @Field(() => Int, { nullable: true })
  read_only: number;

  @Field(() => Int, { nullable: true })
  position: number;

  @Field({ nullable: true })
  fatherId: string;
}
