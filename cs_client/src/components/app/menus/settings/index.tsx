import * as React from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { Drawer } from '::shared-components/drawer/drawer';
import { screens } from '::app/menus/settings/screens';
import { DrawerToggle } from '::shared-components/drawer/components/drawer-toggle/drawer-toggle';
import { ErrorBoundary } from '::shared-components/error-boundary';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { useState } from 'react';

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
  const [selectedScreenTitle, setSelectedScreenTitle] = useState(
    () => Object.keys(screens)[0],
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
          selectedScreenTitle={selectedScreenTitle}
          setSelectedScreenTitle={setSelectedScreenTitle}
        />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};
const _ = connector(Settings);
export default _;
