import modSettings from '::sass-modules/settings/settings.scss';
import * as React from 'react';
import { TDispatchAppReducer } from '::types/react';
import { useCallback, useState } from 'react';
import { Dialog } from '::shared-components/material/dialog';
import { Drawer } from '::shared-components/material/drawer';
import { screens } from '::app/menus/settings/screens';
import { appActions } from '::app/reducer';
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
    <div className={modSettings.settings}>
      <Dialog
        dialogTitle={'Settings'}
        onButton1={cancel}
        onOverlay={cancel}
        button1={'Cancel'}
        button2={'Apply'}
      >
        <Drawer
          screens={screens}
          selectedScreenTitle={selectedTabTitle}
          setSelectedScreenTitle={setSelectedTabTitle}
        />
      </Dialog>
    </div>
  );
};

export { Settings };
