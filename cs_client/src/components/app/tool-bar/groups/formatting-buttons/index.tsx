import modToolbar from '::sass-modules/tool-bar.scss';
import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { exekC } from '::helpers/exekC';

type Props = {};

const FormattingButtons: React.FC<Props> = ({}) => {
  const buttons = [
    {
      button: {
        label: 'b',
        style: undefined
      },
      execCommandArguments: { tagName: 'strong', style: undefined }
    },
    { button: { label: 'i' }, execCommandArguments: { tagName: 'em' } },
    ,
    {
      button: {
        label: 'a',
        style: { textDecoration: 'underline' }
      },
      execCommandArguments: { style: 'text-decoration:underline;' }
    },
    // {
    //   button: {
    //     label: 'a',
    //     style: { textDecoration: 'line-through' }
    //   },
    //   execCommandArguments: { style: 'text-decoration:line-through;' }
    // }
    {
      button: {
        label: 'h1'
      },
      execCommandArguments: { tag: 'h1' }
    }
    // {
    //   button: {
    //     label: 's'
    //   },
    //   execCommandArguments: { tag: 'small' }
    // }
  ];

  return (
    <>
      {buttons.map(
        (
          {
            button: { label, style: buttonStyle },
            execCommandArguments: { tagName, style }
          },
          i
        ) => (
          <ToolbarButton key={i} onClick={() => exekC({ tagName, style })}>
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
