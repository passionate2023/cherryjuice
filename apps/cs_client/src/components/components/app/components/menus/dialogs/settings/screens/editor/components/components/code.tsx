import * as React from 'react';
import { SettingsGroup } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group';
import { SettingsElement } from '::root/components/app/components/menus/dialogs/settings/shared/settings-element';
import { ColorInput } from '@cherryjuice/components';
import { Select } from '::root/components/shared-components/inputs/select';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NumberInput } from '::root/components/shared-components/inputs/number-input';
import { availableFonts } from '::root/components/app/components/menus/dialogs/settings/screens/editor/components/components/helpers/get-fonts-list';

const mapState = (state: Store) => ({
  codeBg: state.editorSettings.current.codeBg,
  codeFont: state.editorSettings.current.codeFont,
  codeFontSize: state.editorSettings.current.codeFontSize,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Code: React.FC<Props & PropsFromRedux> = ({
  codeBg,
  codeFont,
  codeFontSize,
}) => {
  return (
    <SettingsGroup name={'code box'}>
      <SettingsElement name={'background color'}>
        <ColorInput value={codeBg} onChange={ac.editorSettings.setCodeBg} />
      </SettingsElement>
      <SettingsElement name={'font'}>
        <Select
          onChange={ac.editorSettings.setCodeFont}
          options={availableFonts.current}
          value={codeFont}
        />
        <NumberInput
          min={6}
          max={72}
          value={codeFontSize.replace('px', '')}
          onChange={ac.editorSettings.setCodeFontSize}
          label={'font size'}
        />
      </SettingsElement>
    </SettingsGroup>
  );
};

const _ = connector(Code);
export { _ as Code };
