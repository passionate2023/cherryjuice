import * as React from 'react';
import { ToolbarButton } from '::root/app/components/toolbar/components/formatting-buttons/components/tool-bar-button';
import { execK } from '@cherryjuice/editor';
import { Icon } from '::root/shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { HotKey } from '@cherryjuice/graphql-types';
import { formattingHotkeysProps } from '::root/app/components/toolbar/components/formatting-buttons/helpers/formatting-icon-props';
import { useCallback, useRef } from 'react';

const useDebouncedEventHandler = (callback: (value: string) => void, delay) => {
  const pending = useRef<any>();

  return useCallback(e => {
    if (pending.current) {
      clearTimeout(pending.current);
    }
    const value = e.target.value;
    pending.current = setTimeout(() => callback(value), delay);
  }, []);
};

const ColorInput: React.FC<{
  hotKey: HotKey;
  disabled: boolean;
}> = ({ disabled, hotKey: { type } }) => {
  // @ts-ignore
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
