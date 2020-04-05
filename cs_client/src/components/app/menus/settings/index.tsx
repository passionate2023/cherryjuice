import * as React from 'react';
import { TDispatchAppReducer } from '::types/react';
import { useCallback, useState } from 'react';
import { Dialog } from '::shared-components/dialog';
import { Drawer } from '::shared-components/drawer';
import { screens } from '::app/menus/settings/screens';
import { appActions } from '::app/reducer';
import { DrawerToggle } from '::shared-components/drawer/drawer-toggle';
import { ErrorBoundary } from '::shared-components/error-boundary';
type Props = {
  dispatch: TDispatchAppReducer;
};

const Settings: React.FC<Props> = ({ dispatch }) => {
  const [selectedTabTitle, setSelectedTabTitle] = useState(
    'Keyboard Shortcuts',
  );
  const cancel = useCallback(
    () => dispatch({ type: appActions.TOGGLE_SETTINGS }),
    [],
  );

  return (
    <Dialog
      menuButton={<DrawerToggle />}
      dialogTitle={'Settings'}
      onCloseDialog={cancel}
      dialogFooterButtons={[
        { label: 'Cancel', onClick: cancel, disabled: false },
        { label: 'Apply', onClick: cancel, disabled: true },
      ]}
    >
      <ErrorBoundary>
        <Drawer
          screens={screens}
          selectedScreenTitle={selectedTabTitle}
          setSelectedScreenTitle={setSelectedTabTitle}
        />
      </ErrorBoundary>
    </Dialog>
  );
};

// export { Settings };
export default Settings;
