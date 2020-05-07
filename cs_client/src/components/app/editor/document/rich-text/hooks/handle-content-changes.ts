import { useMutationObserver } from '::hooks/dom/mutation-observer';
import { useCallback } from 'react';

const useHandleContentChanges = ({ node_id, ref }) => {
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
          observer.disconnect();
        }
      },
      [node_id],
    ),
  );
};

export { useHandleContentChanges };
