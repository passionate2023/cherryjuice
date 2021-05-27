// @ts-ignore
import HeadlineWorker from './headline.worker.ts';
import { useEffect, useRef, useState } from 'react';
import {
  GenerateHeadlineProps,
  Headlines,
} from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';

type HeadlineProps = GenerateHeadlineProps & { delay: number };
export type STimer = ReturnType<typeof setTimeout>;
const useHeadline = (args: HeadlineProps) => {
  const [processedHeadline, setProcessedHeadline] = useState<Headlines>();
  const timeoutHandle = useRef<STimer>();
  useEffect(() => {
    let headlineWorker: any;
    timeoutHandle.current = setTimeout(() => {
      headlineWorker = new HeadlineWorker();
      headlineWorker.addEventListener('message', event => {
        setProcessedHeadline(event.data);
        headlineWorker.terminate();
      });
      headlineWorker.postMessage(args);
    }, args.delay);
    return () => {
      headlineWorker?.terminate();
      clearTimeout(timeoutHandle.current);
    };
  }, [
    args?.searchResult.ahtmlHeadline,
    args?.searchResult.nodeNameHeadline,
    args?.searchResult.tagsHeadline,
  ]);
  return processedHeadline;
};

export { useHeadline };
