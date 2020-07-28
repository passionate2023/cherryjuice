import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PrivateNode {
  @Field()
  node_id: number;

  @Field()
  father_id: number;
}
