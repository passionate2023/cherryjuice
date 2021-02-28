import * as React from 'react';
import { SettingsGroup } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group';
import { SettingsElement } from '::root/components/app/components/menus/dialogs/settings/shared/settings-element';
import { ColorInput } from '@cherryjuice/components';
import { Select } from '::root/components/shared-components/inputs/select/select';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { availableFonts } from '::root/components/app/components/menus/dialogs/settings/screens/editor/components/components/helpers/get-fonts-list';
import { NumberInput } from '::root/components/shared-components/inputs/number-input';

const mapState = (state: Store) => ({
  monospaceBg: state.editorSettings.current.monospaceBg,
  richTextBg: state.editorSettings.current.richTextBg,
  richTextColor: state.editorSettings.current.richTextColor,
  richTextFont: state.editorSettings.current.richTextFont,
  richTextFontSize: state.editorSettings.current.richTextFontSize,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const RichTextSettings: React.FC<PropsFromRedux> = ({
  monospaceBg,
  richTextBg,
  richTextColor,
  richTextFont,
  richTextFontSize,
}) => {
  return (
    <SettingsGroup name={'rich text'}>
      <SettingsElement name={'background color'}>
        <ColorInput
          value={richTextBg}
          onChange={ac.editorSettings.setRichTextBg}
        />
      </SettingsElement>
      <SettingsElement name={'text color'}>
        <ColorInput
          value={richTextColor}
          onChange={ac.editorSettings.setRichTextColor}
        />
      </SettingsElement>
      <SettingsElement name={'font'}>
        <Select
          onChange={ac.editorSettings.setRichTextFont}
          options={availableFonts.current}
          value={richTextFont}
        />
        <NumberInput
          min={6}
          max={72}
          value={richTextFontSize.replace('px', '')}
          onChange={ac.editorSettings.setRichTextFontSize}
          label={'font size'}
        />
      </SettingsElement>
      <SettingsElement name={'monospace background color'}>
        <ColorInput
          value={monospaceBg}
          onChange={ac.editorSettings.setMonospaceBg}
        />
      </SettingsElement>
    </SettingsGroup>
  );
};

const _ = connector(RichTextSettings);
export { _ as RichText };
