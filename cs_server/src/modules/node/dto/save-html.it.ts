import { Field, InputType } from '@nestjs/graphql';
import { Timestamp } from '../../document/helpers/graphql-types/timestamp';

@InputType()
export class SaveHtmlIt {
  @Field() ahtml: string;
  @Field(() => Timestamp) updatedAt: number;
  @Field(() => [String], { nullable: 'items' })
  deletedImages: string[];
}
