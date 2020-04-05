import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { ColorInput } from '::app/tool-bar/groups/formatting-buttons/color-input';
import { commands } from '::helpers/hotkeys/commands';
import { TDispatchAppReducer } from '::types/react';
import { modToolbar } from '../../../../../assets/styles/modules';
import { Icon } from '../../../../shared-components/icon';

type Props = {
  dispatch: TDispatchAppReducer;
};

const FormattingButtons: React.FC<Props> = ({ dispatch }) => {
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
              dispatch,
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
          dispatch={dispatch}
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
              dispatch,
            })
          }
        >
          <Icon name={icon} small={true} />
        </ToolbarButton>
      ))}
    </div>
  );
};

export { FormattingButtons };
