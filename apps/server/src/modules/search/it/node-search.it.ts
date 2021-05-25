import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Timestamp } from '../../document/helpers/graphql-types/timestamp';
import { SearchSortOptions } from './node-search.it/it/search-sort-options';

export enum SearchScope {
  currentNode = 'current-node',
  childNodes = 'child-nodes',
  currentDocument = 'current-document',
  allDocuments = 'all-documents',
}
registerEnumType(SearchScope, {
  name: 'SearchScope',
});

export enum SearchTarget {
  nodeContent = 'node-content',
  nodeTitle = 'node-title',
  nodeTags = 'node-tags',
}
registerEnumType(SearchTarget, {
  name: 'SearchTarget',
});

export enum SearchType {
  Simple = 'Simple',
  FullText = 'FullText',
  Regex = 'Regex',
}
registerEnumType(SearchType, {
  name: 'SearchType',
});

export enum TimeRange {
  AnyTime = 'AnyTime',
  PastHour = 'PastHour',
  PastDay = 'PastDay',
  PastWeek = 'PastWeek',
  PastMonth = 'PastMonth',
  PastYear = 'PastYear',
  CustomRange = 'CustomRange',
}
registerEnumType(TimeRange, {
  name: 'TimeRange',
});
@InputType()
export class TimeFilter {
  @Field(() => TimeRange)
  rangeName: TimeRange;

  @Field(() => Timestamp)
  rangeStart: Date;

  @Field(() => Timestamp)
  rangeEnd: Date;
}
@InputType()
export class SearchOptions {
  @Field(() => Boolean)
  fullWord: boolean;

  @Field(() => Boolean)
  caseSensitive: boolean;
}

@InputType()
export class NodeSearchIt {
  @Field()
  query: string;

  @Field(() => SearchScope)
  searchScope: SearchScope;

  @Field(() => [SearchTarget])
  searchTarget: SearchTarget[];

  @Field(() => SearchOptions)
  searchOptions: SearchOptions;

  @Field(() => SearchType)
  searchType: SearchType;

  @Field()
  nodeId: string;

  @Field()
  documentId: string;

  @Field(() => TimeFilter)
  createdAtTimeFilter: TimeFilter;

  @Field(() => TimeFilter)
  updatedAtTimeFilter: TimeFilter;

  @Field(() => SearchSortOptions)
  sortOptions: SearchSortOptions;
}
