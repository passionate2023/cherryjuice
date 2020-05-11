import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateNodeIt {
  @Field()
  documentId: string;

  @Field()
  father_id: number;

  @Field(() => Int)
  node_id: number;

  @Field(() => [Int])
  child_nodes: number[];

  @Field()
  name: string;

  @Field(() => Float)
  createdAt: Date;

  @Field(() => Float)
  updatedAt: Date;

  @Field({ nullable: true })
  node_title_styles: string;

  @Field()
  icon_id: string;

  @Field(() => Int)
  read_only: number;

  @Field(() => Int, { nullable: true })
  position: number;
}
