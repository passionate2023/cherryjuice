import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { ButtonCircle } from '@cherryjuice/components';
import { Icon, Icons } from '@cherryjuice/icons';
import { toggleDrawer } from '::root/components/shared-components/drawer/components/drawer-toggle/helpers/create-toggle-handler';

const DrawerToggle: React.FC<{}> = () => {
  return (
    <ButtonCircle
      className={`${modDrawer.drawer__drawerToggle}`}
      onClick={toggleDrawer}
      icon={<Icon {...{ name: Icons.material.menu }} />}
    />
  );
};

export { DrawerToggle };
