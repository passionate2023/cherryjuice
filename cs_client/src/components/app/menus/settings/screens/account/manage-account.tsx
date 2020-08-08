import modSettings from '::sass-modules/settings/settings.scss';
import * as React from 'react';
import { DrawerScreen } from '::shared-components/drawer/drawer';
import { UserProfile } from '::app/menus/settings/screens/account/components/user-profile';

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
