import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { handleToggle } from '::shared-components/drawer/drawer-navigation/helpers';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::shared-components/icon';

const DrawerToggle: React.FC<{}> = () => (
  <ButtonCircle
    className={`${modDrawer.drawer__drawerToggle}`}
    onClick={handleToggle()}
  >
    <Icon name={Icons.material.menu} />
  </ButtonCircle>
);

export { DrawerToggle };
