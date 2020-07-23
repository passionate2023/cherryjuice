import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NodeMutation {
  @Field()
  saveAHtml: string;

  @Field(() => [ID])
  editMeta: string[];

  @Field()
  createNode: string;

  @Field()
  deleteNode: string;
}
