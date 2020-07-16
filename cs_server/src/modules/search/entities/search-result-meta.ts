import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SearchResultMeta {
  @Field(() => Int)
  elapsedTimeMs: number;
}
