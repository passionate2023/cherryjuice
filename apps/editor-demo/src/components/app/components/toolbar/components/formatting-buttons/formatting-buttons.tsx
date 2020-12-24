import * as React from 'react';
import { ToolbarButton, ToolbarColorInput } from '@cherryjuice/components';
import { execK } from '@cherryjuice/editor';
import { modToolbar } from '::sass-modules';
import { Icon } from '@cherryjuice/icons';
import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { formattingHotkeysProps } from '::root/app/components/toolbar/components/formatting-buttons/helpers/formatting-icon-props';

const formattingHotkeys = getDefaultSettings().hotKeys.formatting;

type Props = {};

const Buttons: React.FC<Props> = () => {
  return (
    <>
      {formattingHotkeys.map(hotKey => {
        const formattingHotkeysProp = formattingHotkeysProps[hotKey.type];
        if (!('icon' in formattingHotkeysProp))
          return <React.Fragment key={hotKey.type} />;
        const onChange = value => {
          execK({
            style: {
              ...formattingHotkeysProp.execCommandArguments.style,
              value,
            },
          });
        };
        return hotKey.type === HotKeyActionType.FOREGROUND_COLOR ||
          hotKey.type === HotKeyActionType.BACKGROUND_COLOR ? (
          <ToolbarColorInput
            key={hotKey.type}
            hotKey={hotKey}
            disabled={false}
            icon={formattingHotkeysProp.icon}
            onChange={onChange}
            id={hotKey.type}
          />
        ) : (
          <ToolbarButton
            key={hotKey.type}
            onClick={() => execK(formattingHotkeysProp.execCommandArguments)}
            className={modToolbar.toolBar__iconStrictWidth}
          >
            <Icon name={formattingHotkeysProp.icon} />
          </ToolbarButton>
        );
      })}
    </>
  );
};

const FormattingButtons: React.FC<Props> = () => {
  return (
    <div
      className={
        modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
      }
    >
      <Buttons />
    </div>
  );
};
export { FormattingButtons };
