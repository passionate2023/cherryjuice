import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Timestamp } from '../../document/helpers/graphql-types/timestamp';

@ObjectType()
export class SearchResultMeta {
  @Field(() => Int)
  elapsedTimeMs: number;
  @Field(() => Timestamp)
  timestamp: number;
}
