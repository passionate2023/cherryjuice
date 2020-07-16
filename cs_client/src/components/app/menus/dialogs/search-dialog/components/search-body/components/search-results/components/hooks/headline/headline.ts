import { useEffect, useState } from 'react';
import {
  generateHeadline,
  GenerateHeadlineProps,
  Headline,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';

type HeadlineProps = GenerateHeadlineProps;

const useHeadline = (args: HeadlineProps) => {
  const [processedHeadline, setProcessedHeadline] = useState<Headline>();
  useEffect(() => {
    new Promise(res => res(generateHeadline(args))).then(setProcessedHeadline);
  }, [args.headline]);
  return processedHeadline;
};

export { useHeadline };
