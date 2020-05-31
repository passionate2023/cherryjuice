import { useMutationObserver } from '::hooks/dom/mutation-observer';
import { MutableRefObject, useCallback } from 'react';
import { ac } from '::root/store/actions.types';

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
          ref.current.setAttribute('data-edited', String(new Date().getTime()));
          ac.document.setCacheTimeStamp();
          observer.disconnect();
        }
      },
      [nodeId],
    ),
  );
};

export { useHandleContentChanges };
