import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NodeSearchResultEntity {
  constructor({
    nodeName,
    documentName,
    documentId,
    node_id,
    nodeId,
    headline,
  }: {
    documentId: string;
    node_id: number;
    nodeId: string;
    nodeName: string;
    documentName: string;
    headline: string;
  }) {
    this.documentId = documentId;
    this.node_id = node_id;
    this.nodeId = nodeId;
    this.nodeName = nodeName;
    this.documentName = documentName;
    this.headline = headline;
  }
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
  @Field()
  headline: string;
}
