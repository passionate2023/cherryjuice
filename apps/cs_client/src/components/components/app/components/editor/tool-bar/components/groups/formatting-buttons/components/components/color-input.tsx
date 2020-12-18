import * as React from 'react';
import { ToolbarButton } from '::app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK } from '@cherryjuice/editor';
import { Icon } from '::shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { HotKey } from '@cherryjuice/graphql-types';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props/formatting-props';
import { useDebouncedEventHandler } from '::hooks/react/debounced-event-handler';
import { useCallback } from 'react';

const ColorInput: React.FC<{
  hotKey: HotKey;
  disabled: boolean;
}> = ({ disabled, hotKey: { type } }) => {
  const { icon, execCommandArguments } = formattingHotkeysProps[type];
  const onChange = useCallback(value => {
    execK({
      style: {
        ...execCommandArguments.style,
        value: value,
      },
    });
  }, []);
  const onChangeM = useDebouncedEventHandler(onChange, 200);
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
          onChange={onChangeM}
        />
      </label>
    </ToolbarButton>
  );
};

export { ColorInput };
