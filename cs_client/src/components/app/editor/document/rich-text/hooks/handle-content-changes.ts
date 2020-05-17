import { useMutationObserver } from '::hooks/dom/mutation-observer';
import { MutableRefObject, useCallback } from 'react';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';

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
          updateCachedHtmlAndImages();
          observer.disconnect();
        }
      },
      [nodeId],
    ),
  );
};

export { useHandleContentChanges };
