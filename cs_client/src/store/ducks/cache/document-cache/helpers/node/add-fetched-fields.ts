import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { Image } from '::types/graphql/generated';

export type AddHtmlParams = {
  node_id: number;
  documentId: string;
  data:
    | {
        html: string;
      }
    | { image: Image[] };
};

export const addFetchedFields = (
  state: DocumentCacheState,
  { documentId, node_id, data }: AddHtmlParams,
): DocumentCacheState => {
  const node = state.documents[documentId].nodes[node_id];

  if (data['html'] && node.html) {
    return state;
  }
  Object.entries(data).forEach(([key, value]) => {
    node[key] = value;
  });
  return state;
};
