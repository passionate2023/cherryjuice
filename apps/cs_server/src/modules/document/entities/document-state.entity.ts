import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Timestamp } from '../helpers/graphql-types/timestamp';

@InputType('NodeScrollPositionIt')
@ObjectType()
export class NodeScrollPosition {
  @Field(() => Int)
  x: number;
  @Field(() => Int)
  y: number;
  @Field(() => Int)
  node_id: number;
}

@ObjectType()
@InputType('DocumentStateIt')
export class DocumentState {
  constructor(setDefaultValues = false) {
    if (setDefaultValues) {
      this.selectedNode_id = 0;
      this.treeState = [];
      this.recentNodes = [];
      this.bookmarks = [];
      this.scrollPositions = [];
      this.updatedAt = new Date();
      this.lastOpenedAt = new Date();
    }
  }

  @Field(() => Int)
  selectedNode_id?: number;

  @Field(() => [Int])
  treeState: number[];

  @Field(() => [Int])
  recentNodes: number[];

  @Field(() => [Int])
  bookmarks: number[];

  @Field(() => [NodeScrollPosition])
  scrollPositions: NodeScrollPosition[];

  @Field(() => Timestamp)
  updatedAt: Date;

  @Field(() => Timestamp)
  lastOpenedAt: Date;
}
