import * as React from 'react';
import { useCallback } from 'react';
import { ToolbarButton } from '::app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK, formattingHotkeysProps } from '@cherryjuice/editor';
import { Icon } from '@cherryjuice/icons';
import { modToolbar } from '::sass-modules';
import { HotKey } from '@cherryjuice/graphql-types';
import { useDebouncedEventHandler } from '::hooks/react/debounced-event-handler';

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
        <Icon name={icon} />
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
