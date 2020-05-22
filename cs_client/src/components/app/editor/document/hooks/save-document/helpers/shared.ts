import { SaveOperationState } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { NodeCached } from '::types/graphql/adapters';

type PerformMutationProps<T> = {
  mutate: Function;
  variables: T;
};
const performMutation = async <T>({
  mutate,
  variables,
}: PerformMutationProps<T>): Promise<any> =>
  await new Promise((res, rej) => {
    mutate({
      variables,
      update: (cache, { data }) => {
        res(data);
      },
    }).catch(rej);
  });

const updateDocumentId = (state: SaveOperationState) => (node: NodeCached) => {
  if (state.swappedDocumentIds[node.documentId])
    node.documentId = state.swappedDocumentIds[node.documentId];
};

export { performMutation, updateDocumentId };
