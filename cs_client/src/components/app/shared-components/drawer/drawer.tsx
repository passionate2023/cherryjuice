import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { DrawerNavigation } from '::shared-components/drawer/components/drawer-navigation/drawer-navigation';
import { useEffect } from 'react';
import { updateSubTitle } from '::shared-components/drawer/components/drawer-navigation/helpers/update-sub-title';
import { setupGesturesHandler } from '::shared-components/drawer/components/drawer-navigation/helpers/setup-gesture-handler';
import { toggleDrawer } from '::shared-components/drawer/components/drawer-toggle/helpers/create-toggle-handler';

type DrawerScreen = { element: JSX.Element; category: string; name: string };
type DrawerScreens = {
  [screenName: string]: DrawerScreen;
};

type DrawerProps = {
  screens: DrawerScreens;
  selectedScreenTitle: string;
  customDrawerBody?: JSX.Element;
};

const Drawer: React.FC<DrawerProps> = ({
  screens,
  selectedScreenTitle,
  customDrawerBody,
}) => {
  const toggleHandler = toggleDrawer;
  useEffect(() => {
    updateSubTitle({ selectedScreenTitle });
    setupGesturesHandler({
      onRight: toggleHandler,
      gestureZoneSelector: modDrawer.drawer,
    });
  }, [selectedScreenTitle]);
  return (
    <div className={modDrawer.drawer}>
      <DrawerNavigation screens={screens} />
      <div className={`${modDrawer.drawer__content}`}>
        {customDrawerBody || screens[selectedScreenTitle].element}
      </div>
    </div>
  );
};

export { Drawer };
export { DrawerScreen, DrawerScreens };
