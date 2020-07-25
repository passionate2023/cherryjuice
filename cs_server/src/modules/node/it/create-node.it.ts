import { Field, InputType, Int } from '@nestjs/graphql';
import { Timestamp } from '../../document/helpers/graphql-types/timestamp';
import { Privacy } from '../../document/entities/document.entity';

@InputType()
export class CreateNodeIt {
  @Field()
  father_id: number;

  @Field({ nullable: true })
  fatherId: string;

  @Field(() => Int)
  node_id: number;

  @Field(() => [Int])
  child_nodes: number[];

  @Field()
  name: string;

  @Field(() => Timestamp)
  createdAt: number;

  @Field(() => Timestamp)
  updatedAt: number;

  @Field({ nullable: true })
  node_title_styles: string;

  @Field(() => Int)
  read_only: number;

  @Field(() => Privacy, { nullable: true })
  privacy?: Privacy;
}
