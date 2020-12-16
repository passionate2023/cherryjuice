import { useEffect, useRef } from 'react';
import {
  NumberOfFrames,
  saveNodeContent,
  snapBackManager,
} from '@cherryjuice/editor';

export const useCacheNodeContent = (
  documentId: string,
  node_id: number,
  numberOfFrames: NumberOfFrames,
) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const previousFramesTs = useRef<Record<string, number>>({});
  useEffect(() => {
    const nodeId = documentId + '/' + node_id;
    const previousFrameTs = previousFramesTs.current[nodeId] || 0;
    const newFrameTs = snapBackManager.getCurrentFrameTS(nodeId) || 0;
    if (newFrameTs !== previousFrameTs) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        previousFramesTs.current[nodeId] = newFrameTs;
        saveNodeContent();
      }, 5000);
    }
    return () => {
      clearTimeout(timeout.current);
    };
  }, [numberOfFrames, documentId, node_id]);
};
