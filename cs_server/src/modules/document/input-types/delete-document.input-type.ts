import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteDocumentInputType {
  @Field(() => [String])
  IDs: string[];
}
