import * as React from 'react';
import { modDialog, modSearchResult,} from '::sass-modules';
import { NodeSearchResultEntity } from '@cherryjuice/graphql-types';
import { useHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/headline';
import { SearchContext } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { HighlightedHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/highlighted-headline';
import { ac } from '::store/store';
import { waitForDocumentToLoad } from '::root/components/app/components/editor/hooks/router-effect/helpers/wait-for-document-to-load';

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
        <div
          className={modSearchResult.searchResult__location__nodeName}
          onClick={() => {
            ac.document.setDocumentId(result.documentId);
            waitForDocumentToLoad(result.documentId, () => {
              ac.node.select(result);
            });
          }}
        >
          {headline?.nodeNameHeadline ? (
            <HighlightedHeadline headline={headline.nodeNameHeadline} />
          ) : (
            result.nodeName
          )}
        </div>
      </div>
      {headline?.ahtmlHeadline ? (
        <span className={modSearchResult.searchResult__headline}>
          <HighlightedHeadline headline={headline.ahtmlHeadline} />
        </span>
      ) : (
        <></>
      )}
      <span
        className={joinClassNames([
          modSearchResult.searchResult__timestamps,
          modDialog.dialogListItem__details,
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
