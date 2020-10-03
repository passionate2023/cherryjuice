import { Field, ObjectType } from '@nestjs/graphql';
import { NodeSearchResults } from './node-search-results.entity';

@ObjectType()
export class SearchResultEntity {
  @Field(() => NodeSearchResults)
  node: NodeSearchResults;
}
