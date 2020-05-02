import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Secrets {
  @Field()
  google_client_id: string;

  @Field()
  google_api_key: string;
}
