import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
export type TDialogFooterButton = {
  component?: () => React.Component;
  label: string | JSX.Element;
  disabled: boolean;
  onClick: EventHandler<any>;
  lazyAutoFocus?: number;
};
export type TDialogFooterProps = {
  isOnMobile: boolean;
  dialogFooterLeftButtons: TDialogFooterButton[];
  dialogFooterRightButtons: TDialogFooterButton[];
};

const DialogFooter: React.FC<TDialogFooterProps> = ({
  dialogFooterRightButtons,
  dialogFooterLeftButtons,
  isOnMobile,
}) => {
  return (
    <footer className={`${modDialog.dialog__footer}`}>
      <div>
        {dialogFooterLeftButtons.map(
          ({ component, onClick, label, disabled }, i) =>
            component ? (
              component()
            ) : (
              <ButtonSquare
                key={i}
                className={''}
                onClick={onClick}
                disabled={disabled}
              >
                {label}
              </ButtonSquare>
            ),
        )}
      </div>
      <div>
        {dialogFooterRightButtons.map(
          ({ onClick, label, disabled, lazyAutoFocus }, i) => (
            <ButtonSquare
              key={i}
              className={''}
              onClick={onClick}
              disabled={disabled}
              lazyAutoFocus={!isOnMobile ? lazyAutoFocus : 0}
            >
              {label}
            </ButtonSquare>
          ),
        )}
      </div>
    </footer>
  );
};

export { DialogFooter };
