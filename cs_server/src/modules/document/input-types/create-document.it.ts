import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDocumentIt {
  @Field()
  name: string;
}
