import { ApolloClient } from 'apollo-client';
import { DocumentGuestOt } from '::types/graphql/generated';

export type EditedDocumentMeta = Map<
  'name' | 'privacy' | 'guests' | 'updatedAt',
  string | DocumentGuestOt[] | number
>;
type DocumentChanges = {
  isNew: boolean;
  meta: EditedDocumentMeta;
  node: {
    deleted: Set<string>;
    meta: Map<string, Set<string>>;
    created: Set<string>;
    content: Set<string>;
  };
  image: {
    created: Map<string, Set<string>>;
    deleted: Map<string, Set<string>>;
  };
};
type CacheState = {
  cache: any;
  client: ApolloClient<any>;
  modifications: {
    document: {
      [documentId: string]: DocumentChanges;
    };
  };
};
const getInitialDocumentState = (): DocumentChanges => ({
  isNew: false,
  meta: new Map(),
  node: {
    deleted: new Set<string>(),
    meta: new Map<string, Set<string>>(),
    created: new Set<string>(),
    content: new Set<string>(),
  },
  image: {
    created: new Map<string, Set<string>>(),
    deleted: new Map<string, Set<string>>(),
  },
});
const cacheInitialState: CacheState = {
  cache: undefined,
  client: undefined,
  modifications: {
    document: {},
  },
};
export { cacheInitialState, getInitialDocumentState };
export { CacheState, DocumentChanges };
