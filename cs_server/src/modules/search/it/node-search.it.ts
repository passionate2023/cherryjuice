import { Field, InputType } from '@nestjs/graphql';

type SearchScope =
  | 'current-node'
  | 'child-nodes'
  | 'current-document'
  | 'all-documents';

type SearchType = 'node-content' | 'node-title';

@InputType()
export class NodeSearchIt {
  @Field()
  query: string;

  @Field()
  searchScope: SearchScope;

  @Field(() => [String])
  searchType: SearchType[];

  @Field()
  nodeId: string;

  @Field()
  documentId: string;
}
