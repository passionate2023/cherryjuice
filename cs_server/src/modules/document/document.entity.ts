import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Node } from './modules/node/entities/node.entity';

@ObjectType()
export class Document {
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

  @Field(() => [Node], { nullable: 'items' })
  node: Node[];
}
