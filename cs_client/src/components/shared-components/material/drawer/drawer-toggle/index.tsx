import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { handleToggle } from '::shared-components/material/drawer/drawer-navigation/helpers';
import { CircleButton } from '::shared-components/buttons/circle-button';
import { Icon, Icons } from '::shared-components/icon';

const DrawerToggle: React.FC<{}> = () => (
  <CircleButton
    className={`${modDrawer.drawer__drawerToggle}`}
    onClick={handleToggle()}
  >
    <Icon name={Icons.material.menu} small={true} />
  </CircleButton>
);

export { DrawerToggle };
