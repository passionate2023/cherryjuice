import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { DrawerNavigation } from '::root/components/shared-components/drawer/components/drawer-navigation/drawer-navigation';
import { useEffect } from 'react';
import { updateSubTitle } from '::root/components/shared-components/drawer/components/drawer-navigation/helpers/update-sub-title';
import { setupGesturesHandler } from '::root/components/shared-components/drawer/components/drawer-navigation/helpers/setup-gesture-handler';
import { toggleDrawer } from '::root/components/shared-components/drawer/components/drawer-toggle/helpers/create-toggle-handler';
import { ScreenName } from '::root/components/app/components/menus/dialogs/settings/screens/screens';

type DrawerScreen = { element: JSX.Element; category: string; name: string };
type DrawerScreens = {
  [screenName in ScreenName]: DrawerScreen;
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
  const element =
    customDrawerBody ||
    screens[selectedScreenTitle]?.element ||
    Object.values(screens)[0].element;
  return (
    <div className={modDrawer.drawer}>
      <DrawerNavigation screens={screens} />
      <div className={`${modDrawer.drawer__content}`}>{element}</div>
    </div>
  );
};

export { Drawer };
export { DrawerScreen, DrawerScreens };
