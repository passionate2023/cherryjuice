import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';

type Props = {
  lazyAutoFocus?: number;
  isOnMobile: boolean;
  dialogFooterButtons: {
    label: string | JSX.Element;
    disabled: boolean;
    onClick: EventHandler<any>;
  }[];
};

const DialogFooter: React.FC<Props> = ({
  dialogFooterButtons,
  lazyAutoFocus = 400,
  isOnMobile,
}) => {
  return (
    <footer className={`${modDialog.dialog__footer}`}>
      {dialogFooterButtons.map(({ onClick, label, disabled }, i) => (
        <ButtonSquare
          key={i}
          className={''}
          onClick={onClick}
          disabled={disabled}
          lazyAutoFocus={i === 0 && !isOnMobile ? lazyAutoFocus : 0}
        >
          {label}
        </ButtonSquare>
      ))}
    </footer>
  );
};

export { DialogFooter };
