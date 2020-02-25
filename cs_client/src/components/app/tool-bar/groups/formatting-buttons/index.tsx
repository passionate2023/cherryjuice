import modToolbar from '::sass-modules/tool-bar.scss';
import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { ToolBar } from '::app/tool-bar';
import { useState } from 'react';
import { ColorInput } from '::app/tool-bar/groups/formatting-buttons/color-input';

type Props = {};
const buttons = [
  {
    button: {
      label: 'b',
      style: undefined
    },
    execCommandArguments: { tagName: 'strong', style: undefined }
  },
  { button: { label: 'i' }, execCommandArguments: { tagName: 'em' } },
  {
    button: {
      label: 'a',
      style: { textDecoration: 'underline' }
    },
    execCommandArguments: { style: 'text-decoration:underline;' }
  },
  {
    button: {
      label: 'a',
      style: { textDecoration: 'line-through' }
    },
    execCommandArguments: { style: 'text-decoration:line-through;' }
  },
  ...['h1', 'h2', 'h3'].map(tagName => ({
    button: {
      label: tagName
    },
    execCommandArguments: { tagName }
  })),
  {
    button: {
      label: 'sm'
    },
    execCommandArguments: { tagName: 'small' }
  },
  {
    button: {
      label: 'sp'
    },
    execCommandArguments: { tagName: 'sup' }
  },
  {
    button: {
      label: 'sb'
    },
    execCommandArguments: { tagName: 'sub' }
  },
  {
    button: {
      label: 'm'
    },
    execCommandArguments: { tagName: 'code' }
  }
];

const FormattingButtons: React.FC<Props> = ({}) => {
  return (
    <>
      {[
        ['fg', 'color'],
        ['bg', 'background-color']
      ].map(([label, cssProperty]) => (
        <ColorInput key={label} {...{ label, cssProperty }} />
      ))}
      {buttons.map(
        (
          {
            button: { label, style: buttonStyle },
            execCommandArguments: { tagName, style }
          },
          i
        ) => (
          <ToolbarButton key={i} onClick={() => execK({ tagName, style })}>
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
