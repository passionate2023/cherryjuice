import { Document, DocumentOwnerOt } from '::types/graphql/generated';
import { CacheState } from '::graphql/cache/initial-state';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { ac } from '::store/store';

type DocumentMeta = {
  name?: string;
  owner?: DocumentOwnerOt;
};

type MutateDocumentProps = {
  documentId: string;
  meta: DocumentMeta;
};

const documentHelpers = (state: CacheState) => ({
  create: (documentId: string, document: Document): void => {
    state.cache?.data.set('Document:' + documentId, document);
    state.modifications.document[documentId].isNew = true;
  },
  get: (documentId: string): Document =>
    state.cache?.data.get('Document:' + documentId),
  delete: {
    hard: (documentId: string): void => {
      state.cache?.data.delete('Document:' + documentId);
    },
  },
  mutate: ({ documentId, meta }: MutateDocumentProps): void => {
    Object.entries(meta).forEach(([key, value]) => {
      state.modifications.document[documentId].meta.set(key, value);
    });
    state.modifications.document[documentId].meta.set(
      'updatedAt',
      new Date().getTime(),
    );

    ac.document.setCacheTimeStamp();
  },
  swapId: ({ oldId, newId }) => {
    const document = apolloCache.document.get(oldId);
    document.id = newId;
    apolloCache.document.delete.hard(oldId);
    state.cache.data.set('Document:' + newId, document);
    return document;
  },
});

export { documentHelpers };
