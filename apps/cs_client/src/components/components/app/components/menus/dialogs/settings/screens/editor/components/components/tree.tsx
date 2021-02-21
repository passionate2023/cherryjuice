import * as React from 'react';
import { SettingsGroup } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group';
import { SettingsElement } from '::root/components/app/components/menus/dialogs/settings/shared/settings-element';
import { ColorInput } from '@cherryjuice/components';
import { Select } from '::root/components/shared-components/inputs/select/select';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NumberInput } from '::root/components/shared-components/inputs/number-input';
import { availableFonts } from '::root/components/app/components/menus/dialogs/settings/screens/editor/components/components/helpers/get-fonts-list';

const mapState = (state: Store) => ({
  treeBg: state.editorSettings.current.treeBg,
  treeColor: state.editorSettings.current.treeColor,
  treeFont: state.editorSettings.current.treeFont,
  treeFontSize: state.editorSettings.current.treeFontSize,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Tree: React.FC<PropsFromRedux> = ({
  treeFont,
  treeBg,
  treeColor,
  treeFontSize,
}) => {
  return (
    <SettingsGroup name={'tree'}>
      <SettingsElement name={'background color'}>
        <ColorInput value={treeBg} onChange={ac.editorSettings.setTreeBg} />
      </SettingsElement>
      <SettingsElement name={'text color'}>
        <ColorInput
          value={treeColor}
          onChange={ac.editorSettings.setTreeColor}
        />
      </SettingsElement>
      <SettingsElement name={'font'}>
        <Select
          value={treeFont}
          onChange={ac.editorSettings.setTreeFont}
          options={availableFonts.current}
        />
        <NumberInput
          min={6}
          max={72}
          value={treeFontSize.replace('px', '')}
          onChange={ac.editorSettings.setTreeFontSize}
          label={'font size'}
        />
      </SettingsElement>
    </SettingsGroup>
  );
};

const _ = connector(Tree);
export { _ as Tree };
