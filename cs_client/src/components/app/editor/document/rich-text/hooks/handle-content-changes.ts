import { useMutationObserver } from '::hooks/dom/mutation-observer';
import { MutableRefObject, useCallback } from 'react';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';

const useHandleContentChanges = ({
  nodeId,
  ref,
}: {
  nodeId: string;
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
          documentActionCreators.setNodeHasChanged(nodeId);
          ref.current.setAttribute('data-edited', String(new Date().getTime()));
          observer.disconnect();
        }
      },
      [nodeId],
    ),
  );
};

export { useHandleContentChanges };
