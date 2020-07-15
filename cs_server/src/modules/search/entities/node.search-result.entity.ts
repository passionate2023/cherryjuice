import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Timestamp } from '../../document/helpers/graphql-types/timestamp';

@ObjectType()
export class NodeSearchResultEntity {
  @Field()
  documentId: string;
  @Field(() => Int)
  node_id: number;
  @Field()
  nodeId: string;
  @Field()
  nodeName: string;
  @Field()
  documentName: string;

  @Field({ nullable: true })
  headline?: string;

  @Field({ nullable: true })
  searchedColumn?: string;

  @Field(() => Timestamp)
  createdAt: number;

  @Field(() => Timestamp)
  updatedAt: number;
}
