import modToolbar from '::sass-modules/tool-bar.scss';
import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { ToolBar } from '::app/tool-bar';
import { useState } from 'react';
import { ColorInput } from '::app/tool-bar/groups/formatting-buttons/color-input';
import { hotKeysManager } from '::helpers/hotkeys';
import { commands } from '::helpers/hotkeys/commands';

type Props = {};

const FormattingButtons: React.FC<Props> = ({}) => {
  return (
    <>
      {commands.colors.map(({ label, cssProperty, inputId }) => (
        <ColorInput key={label} {...{ label, cssProperty, inputId }} />
      ))}
      {commands.tagsAndStyles.map(
        (
          { button: { label, style: buttonStyle }, execCommandArguments },
          i
        ) => (
          <ToolbarButton
            key={i}
            onClick={() =>
              execK({
                tagName: execCommandArguments.tagName,
                // @ts-ignore
                style: execCommandArguments?.style,
                // @ts-ignore
                command: execCommandArguments?.command
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
        )
      )}
    </>
  );
};



export { FormattingButtons };
