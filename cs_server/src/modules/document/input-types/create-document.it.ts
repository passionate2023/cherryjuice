import { Field, InputType } from '@nestjs/graphql';
import { DocumentOwner } from '../entities/document.owner.entity';
import { DocumentOwnerIt } from '@cs/graphql-types';
@InputType()
export class CreateDocumentIt {
  @Field()
  name: string;

  @Field(() => DocumentOwner)
  owner: DocumentOwnerIt;
}
