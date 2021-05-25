import * as React from 'react';
import { useHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/headline';
import { SearchTarget, SearchType } from '@cherryjuice/graphql-types';
import { HighlightedHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/highlighted-headline';

type Props = {
  name: string;
  query: string;
  tags: string;
};

const HNodeName: React.FC<Props> = ({ name, query, tags }) => {
  const searchResult = {
    nodeName: name,
    nodeNameHeadline: name.includes(query) ? query : '',
    tags,
    tagsHeadline: tags?.includes(query) ? query : '',
  };
  const headline = useHeadline({
    searchContext: {
      query,
      searchType: SearchType.Simple,
      searchOptions: { caseSensitive: false, fullWord: false },
      searchTarget: [SearchTarget.nodeTitle, SearchTarget.nodeTags],
    },
    searchResult,
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
      {headline?.tagsHeadline && (
        <span style={{ marginLeft: 10 }}>
          <HighlightedHeadline
            headline={headline.tagsHeadline}
            color={'#20b2007a'}
          />
        </span>
      )}
    </div>
  );
};

export { HNodeName };
