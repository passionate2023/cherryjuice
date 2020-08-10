import modSettings from '::sass-modules/settings/settings.scss';
import * as React from 'react';
import { DrawerScreen } from '::root/components/shared-components/drawer/drawer';
import { UserProfile } from '::root/components/app/components/menus/dialogs/settings/screens/account/components/user-profile';

const personalInformationScreen: DrawerScreen = {
  name: 'manage account',
  category: 'account',
  element: (
    <div className={modSettings.settings__screen}>
      <UserProfile />
    </div>
  ),
};

export { personalInformationScreen };
