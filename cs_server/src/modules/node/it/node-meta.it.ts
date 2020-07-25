import { Field, InputType, Int } from '@nestjs/graphql';
import { Timestamp } from '../../document/helpers/graphql-types/timestamp';
import { Privacy } from '../../document/entities/document.entity';

@InputType()
export class NodeMetaIt {
  @Field(() => Int)
  node_id: number;

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

  @Field(() => Int, { nullable: true })
  read_only: number;

  @Field(() => Int, { nullable: true })
  position: number;

  @Field({ nullable: true })
  fatherId: string;

  @Field(() => Timestamp)
  updatedAt: number;

  @Field(() => Privacy, { nullable: true })
  privacy?: Privacy;
}
