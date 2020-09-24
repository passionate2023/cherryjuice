import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { footerLeftButtons } from '::root/components/app/components/menus/dialogs/search-dialog/components/footer-buttons/footer-buttons';
import { SearchBody } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/search-body';

const mapState = (state: Store) => ({
  searchState: state.search.searchState,
  isOnMobile: state.root.isOnMd,
  docked: state.root.dockedDialog,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchDialog: React.FC<Props & PropsFromRedux> = ({
  isOnMobile,
  searchState,
  docked,
}) => {
  const show = searchState !== 'idle';
  return (
    <DialogWithTransition
      dialogTitle={'Search'}
      footerLeftButtons={[]}
      footRightButtons={footerLeftButtons}
      isOnMobile={isOnMobile}
      show={show}
      loading={searchState === 'in-progress'}
      onClose={ac.search.setSearchIdle}
      pinned={docked}
      pinnable={true}
    >
      <ErrorBoundary>
        <SearchBody show={show} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const _ = connector(SearchDialog);
export { _ as SearchDialog };
