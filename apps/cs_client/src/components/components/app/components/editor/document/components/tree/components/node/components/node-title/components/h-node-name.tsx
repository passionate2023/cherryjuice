import * as React from 'react';
import { useHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/headline';
import { SearchTarget, SearchType } from '::types/graphql';
import { HighlightedHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/highlighted-headline';

type Props = {
  name: string;
  query: string;
};

const HNodeName: React.FC<Props> = ({ name, query }) => {
  const headline = useHeadline({
    searchContext: {
      query,
      searchType: SearchType.Simple,
      searchOptions: { caseSensitive: false, fullWord: false },
      searchTarget: [SearchTarget.nodeTitle],
    },
    searchResult: { nodeName: name, nodeNameHeadline: query },
  });
  return (
    <div>
      {headline?.nodeNameHeadline ? (
        <HighlightedHeadline
          headline={headline.nodeNameHeadline}
          color={'#20b2007a'}
        />
      ) : (
        name
      )}
    </div>
  );
};

export { HNodeName };
