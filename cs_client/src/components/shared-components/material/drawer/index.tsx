import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { Screens } from '::shared-components/material/tab';
import { DrawerNavigation } from '::shared-components/material/drawer/drawer-navigation';

const Drawer: React.FC<Screens> = ({
  screens,
  selectedScreenTitle,
  setSelectedScreenTitle,
}) => {
  return (
    <div className={modDrawer.drawer}>
      <DrawerNavigation
        screens={screens}
        setSelectedScreenTitle={setSelectedScreenTitle}
        selectedScreenTitle={selectedScreenTitle}
      />

      <div className={`${modDrawer.drawer__content}`}>
        {screens[selectedScreenTitle]}
      </div>
    </div>
  );
};

export { Drawer };
