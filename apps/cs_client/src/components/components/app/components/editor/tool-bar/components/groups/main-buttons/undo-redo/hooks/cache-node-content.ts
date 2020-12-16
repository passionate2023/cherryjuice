import { useEffect, useRef } from 'react';
import { NumberOfFrames, pagesManager } from '@cherryjuice/editor';

export const useCacheNodeContent = (
  documentId: string,
  node_id: number,
  numberOfFrames: NumberOfFrames,
) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!node_id) return;
    const nodeId = documentId + '/' + node_id;

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      pagesManager.cachePage(nodeId);
    }, 5000);
    return () => {
      clearTimeout(timeout.current);
    };
  }, [numberOfFrames, documentId, node_id]);
};
