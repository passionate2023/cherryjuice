import { Field, InputType, registerEnumType } from '@nestjs/graphql';
export enum SearchScope {
  currentNode = 'current-node',
  childNodes = 'child-nodes',
  currentDocument = 'current-document',
  allDocuments = 'all-documents',
}
export enum SearchTarget {
  nodeContent = 'node-content',
  nodeTitle = 'node-title',
}
registerEnumType(SearchScope, {
  name: 'SearchScope',
});
registerEnumType(SearchTarget, {
  name: 'SearchTarget',
});

@InputType()
export class NodeSearchIt {
  @Field()
  query: string;

  @Field(() => SearchScope)
  searchScope: SearchScope;

  @Field(() => [SearchTarget])
  searchTarget: SearchTarget[];

  @Field()
  nodeId: string;

  @Field()
  documentId: string;
}
