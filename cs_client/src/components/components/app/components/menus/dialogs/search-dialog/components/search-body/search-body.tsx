import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { SearchResults } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/search-results';
import { SearchFilters } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';
import { SearchHeader } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-header/search-header';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

export const DialogBody: React.FC = ({ children }) => (
  <div className={modSearchDialog.searchDialog}>{children}</div>
);

const mapState = (state: Store) => ({
  showFilters: state.search.showFilters,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  show: boolean;
};

const SearchBody: React.FC<Props & PropsFromRedux> = ({
  showFilters,
  show,
}) => {
  return (
    <DialogBody>
      <SearchHeader show={show} />
      <SearchFilters show={showFilters} />
      <SearchResults />
    </DialogBody>
  );
};

const _ = connector(SearchBody);
export { _ as SearchBody };
