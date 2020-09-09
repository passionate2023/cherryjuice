import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog';
import { Drawer } from '::root/components/shared-components/drawer/drawer';
import { screens } from '::root/components/app/components/menus/dialogs/settings/screens/screens';
import { DrawerToggle } from '::root/components/shared-components/drawer/components/drawer-toggle/drawer-toggle';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { useUnsavedSettingsPrompt } from '::root/components/shared-components/drawer/components/drawer-navigation/components/drawer-navigation-element';

const mapState = (state: Store) => ({
  show: state.dialogs.showSettingsDialog,
  isOnMobile: state.root.isOnMd,
  selectedScreen: state.settings.selectedScreen,
  screenHasChanges: state.settings.screenHasChanges,
  saveOperation: state.settings.saveOperation,
  userId: state.auth.user?.id,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Settings: React.FC<Props & PropsFromRedux> = ({
  show,
  userId,
  isOnMobile,
  selectedScreen,
  screenHasChanges,
  saveOperation,
}) => {
  const savePending = saveOperation !== 'idle';
  const saveInProgress = saveOperation === 'in-progress';
  const onClose = useUnsavedSettingsPrompt(
    ac.settings.save,
    ac.dialogs.hideSettingsDialog,
  );
  const apply = ac.settings.save;
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
      show={show && Boolean(userId)}
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
