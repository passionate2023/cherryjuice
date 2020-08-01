import { Field, InputType } from '@nestjs/graphql';
import { DocumentGuest } from '../entities/document-guest.entity';
import { Privacy } from '../entities/document.entity';
@InputType()
export class CreateDocumentIt {
  @Field()
  name: string;

  @Field(() => Privacy)
  privacy: Privacy;

  @Field(() => [DocumentGuest], { nullable: 'items' })
  guests: DocumentGuest[];
}
