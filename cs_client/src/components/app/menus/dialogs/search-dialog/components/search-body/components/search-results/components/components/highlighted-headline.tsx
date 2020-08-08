import * as React from 'react';
import { Headline } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { modSearchResult } from '::sass-modules';

type Props = {};

const HighlightedHeadline: React.FC<{ headline: Headline }> = ({
  headline,
}) => (
  <>
    <span className={modSearchResult.searchResult__headline__end}>
      {headline.start}
    </span>
    <span className={modSearchResult.searchResult__headline__match}>
      {headline.match}
    </span>
    <span className={modSearchResult.searchResult__headline__end}>
      {headline.end}
    </span>
  </>
);

export { HighlightedHeadline };
