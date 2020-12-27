import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchDialog } from '::sass-modules';
import { NodeSearchResults } from '@cherryjuice/graphql-types';

type Props = {
  searchResults: NodeSearchResults;
  hasNoDocuments: boolean;
};

const ResultsHeader: React.FC<Props> = ({ searchResults, hasNoDocuments }) => {
  const numberOfNodes = searchResults.results.length;
  const numberOfDocuments = new Set(
    searchResults.results.map(result => result.documentName),
  ).size;
  const elapsedTimeS =
    searchResults.meta.elapsedTimeMs > 0
      ? searchResults.meta.elapsedTimeMs / 1000.0
      : 0;
  return (
    <div
      className={joinClassNames([
        modSearchDialog.searchDialog__searchResults__header,
      ])}
    >
      {hasNoDocuments && (
        <span>{'You have no documents in your library.'}</span>
      )}
      {!!elapsedTimeS && (
        <>
          <span>
            {numberOfNodes > 0
              ? `found ${numberOfNodes} node${numberOfNodes > 1 ? 's' : ''}`
              : `found no results`}
          </span>
          {!!numberOfNodes && (
            <>
              <span>
                {` across ${numberOfDocuments} document${
                  numberOfDocuments > 1 ? 's' : ''
                }`}
              </span>
              <span>{` (${elapsedTimeS} seconds)`}</span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export { ResultsHeader };
