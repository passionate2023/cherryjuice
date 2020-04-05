import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { DrawerNavigation } from '::shared-components/drawer/drawer-navigation';

const Drawer: React.FC<any> = ({
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
