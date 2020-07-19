import HeadlineWorker from './headline.worker.ts';
import { useEffect, useState } from 'react';
import {
  GenerateHeadlineProps,
  Headlines,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';

type HeadlineProps = GenerateHeadlineProps;

const useHeadline = (args: HeadlineProps) => {
  const [processedHeadline, setProcessedHeadline] = useState<Headlines>();
  useEffect(() => {
    const headlineWorker = new HeadlineWorker();
    headlineWorker.addEventListener('message', event => {
      setProcessedHeadline(event.data);
      headlineWorker.terminate();
    });
    headlineWorker.postMessage(args);
    return () => headlineWorker.terminate();
  }, [args?.searchResult.ahtmlHeadline, args?.searchResult.nodeNameHeadline]);
  return processedHeadline;
};

export { useHeadline };
