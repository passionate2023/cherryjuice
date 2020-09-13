import * as React from 'react';
import { SettingsGroupContainer } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group-container';
import { RichText } from '::root/components/app/components/menus/dialogs/settings/screens/editor/components/components/rich-text';
import { Tree } from './components/tree';
import { Code } from '::root/components/app/components/menus/dialogs/settings/screens/editor/components/components/code';

type Props = {};

const Editor: React.FC<Props> = () => {
  return (
    <SettingsGroupContainer>
      <RichText />
      <Code />
      <Tree />
    </SettingsGroupContainer>
  );
};

export { Editor };
