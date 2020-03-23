import modToolbar from '::sass-modules/tool-bar.scss';
import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { ColorInput } from '::app/tool-bar/groups/formatting-buttons/color-input';
import { commands } from '::helpers/hotkeys/commands';
import { TDispatchAppReducer } from '::types/react';

type Props = {
  dispatch: TDispatchAppReducer;
};

const FormattingButtons: React.FC<Props> = ({ dispatch }) => {
  return (
    <>
      {commands.colors.map(({ label, cssProperty, inputId }) => (
        <ColorInput
          key={label}
          {...{ label, cssProperty, inputId }}
          dispatch={dispatch}
        />
      ))}
      {commands.tagsAndStyles.map(
        (
          { button: { label, style: buttonStyle }, execCommandArguments },
          i,
        ) => (
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
            <span
              style={buttonStyle}
              className={modToolbar.toolBar__letterIcon}
            >
              {label}
            </span>
          </ToolbarButton>
        ),
      )}
    </>
  );
};

export { FormattingButtons };
