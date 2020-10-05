import * as React from 'react';
import { DrawerScreen } from '::root/components/shared-components/drawer/drawer';
import { UserProfile } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/user-profile';
import { SettingsScreen } from '::root/components/app/components/menus/dialogs/settings/shared/settings-screen';

const accountScreen: DrawerScreen = {
  name: 'manage account',
  category: 'account',
  element: (
    <SettingsScreen>
      <UserProfile />
    </SettingsScreen>
  ),
};

export { accountScreen };
