import { Field, InputType, registerEnumType } from '@nestjs/graphql';

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
}
