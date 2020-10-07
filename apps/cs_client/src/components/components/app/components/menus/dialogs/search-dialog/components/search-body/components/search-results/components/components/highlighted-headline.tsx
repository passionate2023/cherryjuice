import * as React from 'react';
import { Headline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { modSearchResult } from '::sass-modules';

type Props = { headline: Headline; color?: string };

const HighlightedHeadline: React.FC<Props> = ({ headline, color }) => (
  <>
    <span className={modSearchResult.searchResult__headline__end}>
      {headline.start}
    </span>
    <span
      className={modSearchResult.searchResult__headline__match}
      style={{ backgroundColor: color || '#99ff2b' }}
    >
      {headline.match}
    </span>
    <span className={modSearchResult.searchResult__headline__end}>
      {headline.end}
    </span>
  </>
);

export { HighlightedHeadline };
