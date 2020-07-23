import { Field, InputType } from '@nestjs/graphql';
import { Timestamp } from '../helpers/graphql-types/timestamp';
import { DocumentOwner } from '../entities/document.owner.entity';

@InputType()
export class EditDocumentIt {
  @Field({ nullable: true })
  name: string;
  @Field(() => Timestamp)
  updatedAt: Date;
  @Field(() => DocumentOwner, { nullable: true })
  owner: DocumentOwner;
}
