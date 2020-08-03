import * as React from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { Drawer } from '::shared-components/drawer/drawer';
import { screens } from '::app/menus/settings/screens';
import { DrawerToggle } from '::shared-components/drawer/components/drawer-toggle/drawer-toggle';
import { ErrorBoundary } from '::shared-components/error-boundary';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';

const mapState = (state: Store) => ({
  show: state.dialogs.showSettingsDialog,
  isOnMobile: state.root.isOnMobile,
  selectedScreen: state.settings.selectedScreen,
  screenHasChanges: state.settings.screenHasChanges,
  saveOperation: state.settings.saveOperation,
});
const mapDispatch = {
  onClose: ac.dialogs.hideSettingsDialog,
  apply: () => ac.settings.save(),
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Settings: React.FC<Props & PropsFromRedux> = ({
  onClose,
  apply,
  show,
  isOnMobile,
  selectedScreen,
  screenHasChanges,
  saveOperation,
}) => {
  const savePending = saveOperation !== 'idle';
  const saveInProgress = saveOperation === 'in-progress';
  return (
    <DialogWithTransition
      menuButton={<DrawerToggle />}
      dialogTitle={'Settings'}
      dialogFooterRightButtons={[
        { label: 'Close', onClick: onClose, disabled: false },
        {
          label: 'Apply',
          onClick: apply,
          disabled: !screenHasChanges || savePending,
        },
      ]}
      loading={saveInProgress}
      dialogFooterLeftButtons={[]}
      isOnMobile={isOnMobile}
      onClose={onClose}
      show={show}
      rightHeaderButtons={[]}
    >
      <ErrorBoundary>
        <Drawer screens={screens} selectedScreenTitle={selectedScreen} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};
const _ = connector(Settings);
export default _;
