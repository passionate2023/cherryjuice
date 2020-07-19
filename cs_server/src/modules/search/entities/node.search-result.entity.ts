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
  nodeNameHeadline?: string;

  @Field({ nullable: true })
  ahtmlHeadline?: string;

  @Field({ nullable: true })
  ahtml_txt?: string;

  @Field(() => Timestamp)
  createdAt: number;

  @Field(() => Timestamp)
  updatedAt: number;
}
