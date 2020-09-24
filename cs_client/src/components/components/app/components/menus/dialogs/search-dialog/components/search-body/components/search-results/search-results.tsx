import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Result } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { ResultsHeader } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/results-header';

const mapState = (state: Store) => ({
  searchResults: state.search.searchResults,
  query: state.search.query,
  searchOptions: state.search.searchOptions,
  searchType: state.search.searchType,
  searchTarget: state.search.searchTarget,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchResults: React.FC<Props & PropsFromRedux> = ({
  searchResults,
  query,
  searchTarget,
  searchType,
  searchOptions,
}) => (
  <div className={modSearchDialog.searchDialog__searchResults}>
    {<ResultsHeader searchResults={searchResults} />}
    <div
      className={joinClassNames([
        modSearchDialog.searchDialog__searchResults__list,
      ])}
    >
      {searchResults.results.map(result => (
        <Result
          key={result.nodeId + searchResults.meta.timestamp}
          result={result}
          searchContext={{
            query,
            searchType,
            searchOptions,
            searchTarget,
          }}
        />
      ))}
    </div>
  </div>
);

const _ = connector(SearchResults);
export { _ as SearchResults };
