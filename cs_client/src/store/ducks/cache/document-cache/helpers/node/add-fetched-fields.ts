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

  if (data['html']) {
    if (node.html) {
      return state;
    } else node.html = data['html'];
  } else if (data['image']) node.image = data['image'];
  return {
    ...state,
    [documentId]: {
      ...state[documentId],
      nodes: {
        ...state[documentId].nodes,
        [node_id]: { ...node },
      },
    },
  };
};
