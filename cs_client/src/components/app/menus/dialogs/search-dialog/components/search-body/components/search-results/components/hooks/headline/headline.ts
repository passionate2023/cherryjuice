import HeadlineWorker from './headline.worker.ts';
import { useEffect, useState } from 'react';
import {
  GenerateHeadlineProps,
  Headline,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';

type HeadlineProps = GenerateHeadlineProps;

const useHeadline = (args: HeadlineProps) => {
  const [processedHeadline, setProcessedHeadline] = useState<Headline>();
  useEffect(() => {
    const headlineWorker = new HeadlineWorker();
    headlineWorker.addEventListener('message', event => {
      setProcessedHeadline(event.data);
      headlineWorker.terminate();
    });
    headlineWorker.postMessage(args);
    return () => headlineWorker.terminate();
  }, [args.headline]);
  return processedHeadline;
};

export { useHeadline };
