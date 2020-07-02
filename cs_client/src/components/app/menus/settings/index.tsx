import * as React from 'react';
import { useState } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { Drawer } from '::shared-components/drawer';
import { screens } from '::app/menus/settings/screens';
import { DrawerToggle } from '::shared-components/drawer/drawer-toggle';
import { ErrorBoundary } from '::shared-components/error-boundary';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';

const mapState = (state: Store) => ({
  show: state.dialogs.showSettingsDialog,
  isOnMobile: state.root.isOnMobile,
});
const mapDispatch = {
  onClose: ac.dialogs.hideSettingsDialog,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Settings: React.FC<Props & PropsFromRedux> = ({
  onClose,
  show,
  isOnMobile,
}) => {
  const [selectedTabTitle, setSelectedTabTitle] = useState(
    'Keyboard Shortcuts',
  );

  return (
    <DialogWithTransition
      menuButton={<DrawerToggle />}
      dialogTitle={'Settings'}
      dialogFooterRightButtons={[
        { label: 'Close', onClick: onClose, disabled: false },
        { label: 'Apply', onClick: onClose, disabled: true },
      ]}
      dialogFooterLeftButtons={[]}
      isOnMobile={isOnMobile}
      onClose={onClose}
      show={show}
    >
      <ErrorBoundary>
        <Drawer
          screens={screens}
          selectedScreenTitle={selectedTabTitle}
          setSelectedScreenTitle={setSelectedTabTitle}
        />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};
const _ = connector(Settings);
export default _;
