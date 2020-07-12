import * as React from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { footerLeftButtons } from '::app/menus/dialogs/search-dialog/components/footer-buttons/footer-buttons';
import { SearchBody } from '::app/menus/dialogs/search-dialog/components/search-body/search-body';

const mapState = (state: Store) => ({
  searchState: state.search.searchState,
  isOnMobile: state.root.isOnMobile,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchDialog: React.FC<Props & PropsFromRedux> = ({
  isOnMobile,
  searchState,
}) => {
  return (
    <DialogWithTransition
      dialogTitle={'Search'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={footerLeftButtons}
      isOnMobile={isOnMobile}
      show={searchState !== 'idle'}
      loading={searchState === 'in-progress'}
      onClose={ac.search.setSearchIdle}
      rightHeaderButtons={[]}
    >
      <ErrorBoundary>
        <SearchBody />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const _ = connector(SearchDialog);
export { _ as SearchDialog };
