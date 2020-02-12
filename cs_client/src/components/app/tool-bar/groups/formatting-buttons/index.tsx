import modToolbar from '::sass-modules/tool-bar.scss';
import * as React from 'react';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';

type Props = {};

const FormattingButtons: React.FC<Props> = ({}) => {

  const buttons = [
    {
      label: 'b',
      execCommandArguments: ['bold'],
    },
    { label: 'i', execCommandArguments: ['italic'] },
    {
      label: 'a',
      execCommandArguments: ['underline'],
      style: { textDecoration: 'underline' }
    },
    {
      label: 'a',
      execCommandArguments: ['strikeThrough'],
      style: { textDecoration: 'line-through' }
    },
    {
      label: 'H1',
      execCommandArguments: ['heading', null, 'h1']
    },
    {
      label: 's',
      execCommandArguments: ['decreaseFontSize']
    }
  ];

  return (
    <>
      {buttons.map(({ label, execCommandArguments, style }) => (
        <ToolbarButton
          key={label + execCommandArguments.join('')}
          onClick={() => document.execCommand(...execCommandArguments)}
        >
          <span style={style} className={modToolbar.toolBar__letterIcon}>
            {label}
          </span>
        </ToolbarButton>
      ))}
    </>
  );
};

export { FormattingButtons };
