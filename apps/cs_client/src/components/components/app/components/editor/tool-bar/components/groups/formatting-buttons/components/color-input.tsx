import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK } from '::helpers/editing/execK';
import { Icon } from '::root/components/shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { HotKey } from '@cherryjuice/graphql-types';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/formatting-props';

const ColorInput: React.FC<{
  hotKey: HotKey;
  disabled: boolean;
}> = ({ disabled, hotKey: { type } }) => {
  const { icon, execCommandArguments } = formattingHotkeysProps[type];
  return (
    <ToolbarButton
      className={modToolbar.toolBar__iconStrictWidth}
      disabled={disabled}
    >
      <label htmlFor={type} style={!disabled ? { cursor: 'pointer' } : {}}>
        <Icon name={icon} loadAsInlineSVG={'force'} />
        <input
          id={type}
          type="color"
          style={{ display: 'none' }}
          onChange={e => {
            execK({
              style: {
                ...execCommandArguments.style,
                value: `${e.target.value}`,
              },
            });
          }}
        />
      </label>
    </ToolbarButton>
  );
};

export { ColorInput };
