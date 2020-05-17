import * as React from 'react';
import { TDispatchAppReducer } from '::types/react';
import { useCallback, useState } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { Drawer } from '::shared-components/drawer';
import { screens } from '::app/menus/settings/screens';
import { appActions } from '::app/reducer';
import { DrawerToggle } from '::shared-components/drawer/drawer-toggle';
import { ErrorBoundary } from '::shared-components/error-boundary';
type Props = {
  dispatch: TDispatchAppReducer;
  showDialog: boolean;
  isOnMobile: boolean;
};

const Settings: React.FC<Props> = ({ dispatch, showDialog, isOnMobile }) => {
  const [selectedTabTitle, setSelectedTabTitle] = useState(
    'Keyboard Shortcuts',
  );
  const cancel = useCallback(
    () => dispatch({ type: appActions.TOGGLE_SETTINGS }),
    [],
  );

  return (
    <DialogWithTransition
      menuButton={<DrawerToggle />}
      dialogTitle={'Settings'}
      dialogFooterRightButtons={[
        { label: 'Close', onClick: cancel, disabled: false },
        { label: 'Apply', onClick: cancel, disabled: true },
      ]}
      dialogFooterLeftButtons={[]}
      isOnMobile={isOnMobile}
      onClose={cancel}
      show={showDialog}
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

export default Settings;
