import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { footerLeftButtons } from '::root/components/app/components/menus/dialogs/search-dialog/components/footer-buttons/footer-buttons';
import { dialogHeaderButtons } from '::root/components/app/components/menus/dialogs/search-dialog/components/header-buttons/header-buttons';
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
  return (
    <DialogWithTransition
      dialogTitle={'Search'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={footerLeftButtons}
      isOnMobile={isOnMobile}
      show={searchState !== 'idle'}
      loading={searchState === 'in-progress'}
      onClose={ac.search.setSearchIdle}
      rightHeaderButtons={dialogHeaderButtons({ docked })}
      docked={docked}
      measurable={true}
    >
      <ErrorBoundary>
        <SearchBody />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const _ = connector(SearchDialog);
export { _ as SearchDialog };
