import { Field, ObjectType } from '@nestjs/graphql';
import { NodeMutation } from '../../node/entities/node-mutation.entity';

@ObjectType()
export class DocumentMutation {
  @Field()
  uploadFile: boolean;

  @Field()
  deleteDocument: string;

  @Field()
  node: NodeMutation;
}
