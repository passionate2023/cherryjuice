import * as React from 'react';
import { modDialog } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Result } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { ResultsHeader } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/results-header';
import {
  getCurrentDocument,
  getDocumentsList,
} from '::store/selectors/cache/document/document';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    searchResults: state.search.searchResults,
    query: state.search.query,
    searchOptions: state.search.searchOptions,
    searchType: state.search.searchType,
    searchTarget: state.search.searchTarget,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    documentId: document?.id,
    hasNoDocuments: getDocumentsList(state).length === 0,
  };
};
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
  documentId,
  selectedNode_id,
  hasNoDocuments,
}) => (
  <div className={modDialog.dialogSurface}>
    {
      <ResultsHeader
        searchResults={searchResults}
        hasNoDocuments={hasNoDocuments}
      />
    }
    <div className={joinClassNames([modDialog.dialogBody__scrollableSurface])}>
      {searchResults.results.map(result => (
        <Result
          key={result.nodeId + searchResults.meta.timestamp}
          documentId={documentId}
          selectedNode_id={selectedNode_id}
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
