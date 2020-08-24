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
  const node = state[documentId].nodes[node_id];

  if (data['html'] && node.html) {
    return state;
  }
  return {
    ...state,
    [documentId]: {
      ...state[documentId],
      nodes: {
        ...state[documentId].nodes,
        [node_id]: { ...node, ...data },
      },
    },
  };
};
