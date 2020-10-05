import { Field, ObjectType } from '@nestjs/graphql';
import { SearchResultMeta } from './search-result-meta';
import { NodeSearchResultEntity } from './node.search-result.entity';

@ObjectType()
export class NodeSearchResults {
  constructor() {
    this.meta = new SearchResultMeta();
  }
  @Field(() => [NodeSearchResultEntity], { nullable: 'items' })
  results: NodeSearchResultEntity[];
  @Field(() => SearchResultMeta)
  meta: SearchResultMeta;
}
