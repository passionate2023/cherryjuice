import { Field, InputType } from '@nestjs/graphql';
import { Timestamp } from '../helpers/graphql-types/timestamp';

@InputType()
export class EditDocumentIt {
  @Field({ nullable: true })
  name: string;
  @Field(() => Timestamp)
  updatedAt: number;
}
