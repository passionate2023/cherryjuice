import * as React from 'react';
import { modSearchResult } from '::sass-modules';
import { NodeSearchResultEntity } from '@cherryjuice/graphql-types';
import { useHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/headline';
import { SearchContext } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { HighlightedHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/highlighted-headline';
import { ac } from '::store/store';
import { waitForDocumentToLoad } from '::root/components/app/components/editor/hooks/router-effect/helpers/wait-for-document-to-load';
import { NodeNameAndTags } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/node-name-and-tags';
import { TimeStamps } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/time-stamps';
import { memo } from 'react';

type Props = {
  result: NodeSearchResultEntity;
  searchContext: SearchContext;
  selectedNode_id: number;
  documentId: string;
  listIndex: number;
};

const Result: React.FC<Props> = ({
  result,
  searchContext,
  selectedNode_id,
  documentId,
  listIndex,
}) => {
  const headline = useHeadline({
    searchContext,
    searchResult: result,
    delay: listIndex * 50 + 100,
  });
  const selectNode = () => {
    ac.document.setDocumentId(result.documentId);
    waitForDocumentToLoad(result.documentId, () => {
      // const element = Object.values(headline).filter(Boolean)[0];
      // const { start, end } = element;
      // const hash =
      //   start && end
      //     ? `#:~:text=${encodeURIComponent('by')},${encodeURIComponent(
      //         'galaxy',
      //       )}`
      //     : undefined;
      ac.node.select({
        documentId: result.documentId,
        node_id: result.node_id,
        // hash,
      });
    });
  };

  return (
    <div
      className={joinClassNames([
        modSearchResult.searchResult,
        [
          modSearchResult.searchResultSelected,
          result?.documentId === documentId &&
            result?.node_id === selectedNode_id,
        ],
      ])}
      onClick={selectNode}
    >
      <div className={modSearchResult.searchResult__location}>
        <div className={modSearchResult.searchResult__location__documentName}>
          {result.documentName}
        </div>
        <NodeNameAndTags
          name={result.nodeName}
          tags={result.tags}
          headline={headline}
        />
      </div>
      <span className={modSearchResult.searchResult__headline}>
        {headline?.ahtmlHeadline && (
          <HighlightedHeadline headline={headline.ahtmlHeadline} />
        )}
      </span>
      <TimeStamps createdAt={result.createdAt} updatedAt={result.updatedAt} />
    </div>
  );
};
const M = memo(Result);
export { M as Result };
