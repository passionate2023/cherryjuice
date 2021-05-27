import { DrawerScreen } from '::shared-components/drawer/drawer';
import * as React from 'react';
import { About } from '::app/components/menus/dialogs/settings/screens/about/components/about';

const aboutScreen: DrawerScreen = {
  name: 'about',
  category: 'help',
  element: <About />,
};

export { aboutScreen };
