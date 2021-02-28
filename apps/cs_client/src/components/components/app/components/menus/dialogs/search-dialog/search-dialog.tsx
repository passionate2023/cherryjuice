import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { footerLeftButtons } from '::root/components/app/components/menus/dialogs/search-dialog/components/footer-buttons/footer-buttons';
import { SearchBody } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/search-body';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => ({
  searchState: state.search.searchState,
  docked: state.root.dockedDialog,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SearchDialog: React.FC<PropsFromRedux> = ({ searchState, docked }) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const show = searchState !== 'idle';
  return (
    <DialogWithTransition
      dialogTitle={'Search'}
      footerLeftButtons={[]}
      footRightButtons={footerLeftButtons}
      isOnMobile={mbOrTb}
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
export default _;
