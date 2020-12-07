import { useMutationObserver } from '::hooks/dom/mutation-observer';
import { MutableRefObject, useCallback } from 'react';
import { bridge } from '::editor/bridge';

const useFlagEditedNode = ({
  node_id,
  documentId,
  ref,
}: {
  node_id: number;
  documentId: string;
  ref: MutableRefObject<HTMLDivElement>;
}) => {
  useMutationObserver(
    ref,
    useCallback(
      (MutationRecords, observer) => {
        const userMutations = MutationRecords.filter(
          mutationRecord =>
            !(
              mutationRecord.type === 'attributes' &&
              // @ts-ignore
              mutationRecord.target?.classList.contains('rich-text__image')
            ),
        );
        if (userMutations.length) {
          ref.current.setAttribute('data-edited', String(new Date().getTime()));
          bridge.current.flagEditedNode({ node_id, documentId });
          observer.disconnect();
        }
      },
      [node_id, documentId],
    ),
  );
};

export { useFlagEditedNode };
