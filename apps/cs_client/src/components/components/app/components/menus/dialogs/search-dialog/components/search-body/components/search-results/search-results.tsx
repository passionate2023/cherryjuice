import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Result } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';
import { ResultsHeader } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/results-header';
import {
  getCurrentDocument,
  getDocumentsList,
} from '::store/selectors/cache/document/document';
import { memo } from 'react';
import { DialogScrollableSurface } from '::shared-components/dialog/dialog-list/dialog-scrollable-surface';

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

const SearchResults: React.FC<PropsFromRedux> = ({
  searchResults,
  query,
  searchTarget,
  searchType,
  searchOptions,
  documentId,
  selectedNode_id,
  hasNoDocuments,
}) => (
  <DialogScrollableSurface
    header={
      <ResultsHeader
        searchResults={searchResults}
        hasNoDocuments={hasNoDocuments}
      />
    }
  >
    {searchResults.results.map((result, i) => (
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
        listIndex={i}
      />
    ))}
  </DialogScrollableSurface>
);

const _ = connector(SearchResults);
const M = memo(_);
export { M as SearchResults };
