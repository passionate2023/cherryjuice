import * as React from 'react';
import { modSearchResult, modSelectFile } from '::sass-modules';
import { NodeSearchResultEntity } from '::types/graphql/generated';
import { Link } from 'react-router-dom';
import { useHeadline } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/headline';
import { SearchContext } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { HighlightedHeadline } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/highlighted-headline';

type Props = {
  result: NodeSearchResultEntity;
  searchContext: SearchContext;
};

const Result: React.FC<Props> = ({ result, searchContext }) => {
  const headline = useHeadline({
    searchContext,
    searchResult: result,
  });
  return (
    <div className={modSearchResult.searchResult}>
      <div className={modSearchResult.searchResult__location}>
        <div className={modSearchResult.searchResult__location__documentName}>
          {result.documentName}
        </div>
        <Link
          className={modSearchResult.searchResult__location__nodeName}
          to={`/document/${result.documentId}/node/${result.node_id}`}
        >
          {headline?.nodeNameHeadline ? (
            <HighlightedHeadline headline={headline.nodeNameHeadline} />
          ) : (
            result.nodeName
          )}
        </Link>
      </div>
      <span className={modSearchResult.searchResult__headline}>
        {headline?.ahtmlHeadline ? (
          <HighlightedHeadline headline={headline.ahtmlHeadline} />
        ) : (
          <></>
        )}
      </span>
      <span
        className={joinClassNames([
          modSearchResult.searchResult__timestamps,
          modSelectFile.selectFile__file__details,
        ])}
      >
        <span
          className={joinClassNames([
            modSearchResult.searchResult__timestamps__item,
          ])}
        >{`created ${new Date(result.createdAt).toUTCString()}`}</span>
        <span
          className={joinClassNames([
            modSearchResult.searchResult__timestamps__separator,
          ])}
        >
          -
        </span>
        <span
          className={joinClassNames([
            modSearchResult.searchResult__timestamps__item,
          ])}
        >{`updated ${new Date(result.updatedAt).toUTCString()}`}</span>
      </span>
    </div>
  );
};

export { Result };
