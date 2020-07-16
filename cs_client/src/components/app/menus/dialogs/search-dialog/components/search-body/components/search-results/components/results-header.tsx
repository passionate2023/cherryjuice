import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchDialog } from '::sass-modules/';
import { NodeSearchResults } from '::types/graphql/generated';

type Props = {
  searchResults: NodeSearchResults;
};

const ResultsHeader: React.FC<Props> = ({ searchResults }) => {
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
      {!!elapsedTimeS && (
        <>
          <span>found {numberOfNodes} nodes</span>
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
