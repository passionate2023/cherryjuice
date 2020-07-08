import * as React from 'react';
import { modSearchDialog } from '::sass-modules/';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { Result } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';

const mapState = (state: Store) => ({
  searchResults: state.search.searchResults,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ResultsList: React.FC<Props & PropsFromRedux> = ({ searchResults }) => {
  return (
    <div className={modSearchDialog.searchDialog__searchResults}>
      {searchResults.map(result => (
        <Result key={result.nodeId} result={result} />
      ))}
    </div>
  );
};

const _ = connector(ResultsList);
export { _ as ResultsList };
