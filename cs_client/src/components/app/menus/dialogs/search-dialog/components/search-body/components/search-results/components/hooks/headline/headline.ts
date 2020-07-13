import { useEffect, useState } from 'react';
import {
  generateHeadline,
  GenerateHeadlineProps,
  Headline,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';

type HeadlineProps = GenerateHeadlineProps;

const useHeadline = ({
  headline,
  query,
  searchOptions,
  searchType,
}: HeadlineProps) => {
  const [processedHeadline, setProcessedHeadline] = useState<Headline>();
  useEffect(() => {
    setProcessedHeadline(
      generateHeadline({ headline, query, searchOptions, searchType }),
    );
  }, [headline]);
  return processedHeadline;
};

export { useHeadline };
