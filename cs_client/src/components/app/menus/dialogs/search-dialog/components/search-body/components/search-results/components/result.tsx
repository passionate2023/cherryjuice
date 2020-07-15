import * as React from 'react';
import { modSearchResult, modSelectFile } from '::sass-modules/';
import { NodeSearchResultEntity } from '::types/graphql/generated';
import { Link } from 'react-router-dom';
import { useHeadline } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/headline';
import { GenerateHeadlineProps } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { joinClassNames } from '::helpers/dom/join-class-names';

type Props = {
  result: NodeSearchResultEntity;
  searchMeta: Omit<GenerateHeadlineProps, 'headline'>;
};

const Result: React.FC<Props> = ({ result, searchMeta }) => {
  const headline = useHeadline({
    headline: result.headline,
    searchedColumn: result.searchedColumn,
    ...searchMeta,
  });
  return (
    <div className={modSearchResult.searchResult}>
      <span className={modSearchResult.searchResult__headline}>
        {headline?.match && (
          <>
            <span>{headline.start}</span>
            <span className={modSearchResult.searchResult__match}>
              {headline.match}
            </span>
            <span>{headline.end}</span>
          </>
        )}
      </span>
      <Link
        className={modSearchResult.searchResult__link}
        to={`/document/${result.documentId}/node/${result.node_id}`}
      >
        {result.documentName}/{result.nodeName}
      </Link>
      <span
        className={joinClassNames([
          modSearchResult.searchResult__info,
          modSelectFile.selectFile__file__details,
        ])}
      >
        <span
          className={joinClassNames([modSearchResult.searchResult__info__item])}
        >{`created ${new Date(result.createdAt).toUTCString()}`}</span>
        <span>-</span>
        <span
          className={joinClassNames([modSearchResult.searchResult__info__item])}
        >{`updated ${new Date(result.updatedAt).toUTCString()}`}</span>
      </span>
    </div>
  );
};

export { Result };
