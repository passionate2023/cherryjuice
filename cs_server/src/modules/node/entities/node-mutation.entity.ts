import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NodeMutation {
  @Field()
  saveAHtml: string;
}
