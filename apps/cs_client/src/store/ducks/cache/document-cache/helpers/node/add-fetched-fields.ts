import { DocumentCacheState } from '::store/ducks/cache/document-cache';
import { Image } from '::types/graphql';

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
  nodes: AddHtmlParams[],
): DocumentCacheState => {
  nodes.forEach(({ node_id, data, documentId }) => {
    const node = state.documents[documentId].nodes[node_id];

    if (data['html'] && node.html) {
      return state;
    }
    Object.entries(data).forEach(([key, value]) => {
      node[key] = value;
    });
  });
  return state;
};
