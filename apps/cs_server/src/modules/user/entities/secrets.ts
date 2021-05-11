import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Secrets {
  @Field({ nullable: true })
  google_client_id: string;

  @Field({ nullable: true })
  google_api_key: string;
}
