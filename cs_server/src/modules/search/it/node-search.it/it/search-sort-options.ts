import { SortNodesBy } from '../enums/sort-nodes-by';
import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from '../enums/sort-direction';

@InputType()
export class SearchSortOptions {
  @Field(() => SortNodesBy)
  sortBy: SortNodesBy;

  @Field(() => SortDirection)
  sortDirection: SortDirection;
}
