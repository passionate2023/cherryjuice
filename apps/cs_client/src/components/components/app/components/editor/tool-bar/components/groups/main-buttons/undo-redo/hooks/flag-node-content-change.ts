import { useEffect, useRef } from 'react';
import { MutateNodeContentFlag } from '::store/ducks/document-cache/helpers/node/mutate-node-content';
import { ac } from '::store/store';
import { NumberOfFrames } from '@cherryjuice/editor';

export const useFlagNodeContentChange = (
  documentId: string,
  node_id: number,
  numberOfFrames: NumberOfFrames,
) => {
  const previousFlags = useRef<Record<string, MutateNodeContentFlag>>({});
  useEffect(() => {
    const previousFlag = previousFlags.current[documentId + '/' + node_id];
    const newFlag =
      numberOfFrames.undo > 0
        ? 'list'
        : numberOfFrames.undo === 0 && previousFlag === 'list'
        ? 'unlist'
        : undefined;
    if (newFlag && newFlag !== previousFlag) {
      previousFlags.current[documentId + '/' + node_id] = newFlag;
      ac.documentCache.mutateNodeContent({
        node_id,
        documentId,
        data: { html: '' },
        meta: { flag: newFlag },
      });
    }
  }, [numberOfFrames, node_id, documentId]);
};
