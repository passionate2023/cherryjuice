import {
  DrawerScreen,
  DrawerScreens,
} from '::root/components/shared-components/drawer/drawer';

const groupScreensByName = (screens: DrawerScreen[]): DrawerScreens => {
  const drawerScreens: DrawerScreens = {};

  screens.forEach(screen => {
    drawerScreens[screen.name] = screen;
  });

  return drawerScreens;
};

export { groupScreensByName };
