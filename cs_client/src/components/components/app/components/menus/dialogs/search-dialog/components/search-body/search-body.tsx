import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { SearchResults } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/search-results';
import { SearchFilters } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';
import { SearchHeader } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-header/search-header';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

const mapState = (state: Store) => ({
  showFilters: state.search.showFilters,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchBody: React.FC<Props & PropsFromRedux> = ({ showFilters }) => {
  return (
    <div className={modSearchDialog.searchDialog}>
      <SearchHeader showFilters={showFilters} />
      <SearchFilters show={showFilters} />
      <SearchResults collapse={showFilters} />
    </div>
  );
};

const _ = connector(SearchBody);
export { _ as SearchBody };
