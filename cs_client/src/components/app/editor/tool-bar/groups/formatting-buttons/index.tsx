import * as React from 'react';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { ColorInput } from '::app/editor/tool-bar/groups/formatting-buttons/color-input';
import { commands } from '::helpers/hotkeys/commands';
import { modToolbar } from '::sass-modules/index';
import { Icon } from '::shared-components/icon';

type Props = {};

const FormattingButtons: React.FC<Props> = () => {
  return (
    <div
      className={
        modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
      }
    >
      {commands.tagsAndStyles.map(({ icon, execCommandArguments }, i) => (
        <ToolbarButton
          key={i}
          onClick={() =>
            execK({
              tagName: execCommandArguments.tagName,
              // @ts-ignore
              style: execCommandArguments?.style,
              // @ts-ignore
              command: execCommandArguments?.command,
            })
          }
        >
          <Icon name={icon} small={true} />
        </ToolbarButton>
      ))}
      {commands.colors.map(({ icon, label, cssProperty, inputId }) => (
        <ColorInput
          key={label}
          icon={icon}
          {...{ label, cssProperty, inputId }}
        />
      ))}
      {commands.misc.map(({ icon, execCommandArguments }, i) => (
        <ToolbarButton
          key={i}
          onClick={() =>
            execK({
              tagName: execCommandArguments.tagName,
              // @ts-ignore
              style: execCommandArguments?.style,
              // @ts-ignore
              command: execCommandArguments?.command,
            })
          }
        >
          <Icon name={icon} small={true} />
        </ToolbarButton>
      ))}
    </div>
  );
};

export default FormattingButtons;
