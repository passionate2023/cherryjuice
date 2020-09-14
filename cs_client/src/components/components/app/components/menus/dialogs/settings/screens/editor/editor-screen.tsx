import * as React from 'react';
import { DrawerScreen } from '::root/components/shared-components/drawer/drawer';
import { SettingsScreen } from '::root/components/app/components/menus/dialogs/settings/shared/settings-screen';
import { Editor } from '::root/components/app/components/menus/dialogs/settings/screens/editor/components/editor';

const editorScreen: DrawerScreen = {
  name: 'editor',
  category: 'app',
  element: (
    <SettingsScreen>
      <Editor />
    </SettingsScreen>
  ),
};

export { editorScreen };
