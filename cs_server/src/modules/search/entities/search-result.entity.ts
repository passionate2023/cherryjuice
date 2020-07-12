import { ObjectType } from '@nestjs/graphql';
import { NodeSearchResultEntity } from './node.search-result.entity';

@ObjectType()
export class SearchResultEntity {
  node: NodeSearchResultEntity[];
}
