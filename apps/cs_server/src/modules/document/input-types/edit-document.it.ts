import { Field, InputType } from '@nestjs/graphql';
import { Timestamp } from '../helpers/graphql-types/timestamp';
import { DocumentGuest } from '../entities/document-guest.entity';
import { Privacy } from '../entities/document.entity';
import { DocumentGuestIt } from '@cherryjuice/graphql-types';
@InputType()
export class EditDocumentIt {
  @Field({ nullable: true })
  name: string;
  @Field(() => Timestamp)
  updatedAt: Date;
  @Field(() => [DocumentGuest], { nullable: 'itemsAndList' })
  guests?: DocumentGuestIt[];
  @Field(() => Privacy, { nullable: true })
  privacy: Privacy;

  @Field({ nullable: true })
  folderId: string;
}
