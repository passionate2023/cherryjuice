import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';

type Props = {
  dialogFooterButtons: {
    label: string | JSX.Element;
    disabled: boolean;
    onClick: EventHandler<any>;
  }[];
};

const DialogFooter: React.FC<Props> = ({ dialogFooterButtons }) => {
  return (
    <footer className={`${modDialog.dialog__footer}`}>
      {dialogFooterButtons.map(({ onClick, label, disabled }, i) => (
        <ButtonSquare
          key={i}
          className={''}
          onClick={onClick}
          disabled={disabled}
          autoFocus={i === 0}
        >
          {label}
        </ButtonSquare>
      ))}
    </footer>
  );
};

export { DialogFooter };
