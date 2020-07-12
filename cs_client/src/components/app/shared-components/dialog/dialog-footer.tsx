import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
export type TDialogFooterButton = {
  component?: () => React.Component;
  label: string;
  disabled: boolean;
  onClick: EventHandler<any>;
  lazyAutoFocus?: number;
  testId?: string;
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
          ({ component, onClick, label, disabled, testId }, i) =>
            component ? (
              component()
            ) : (
              <ButtonSquare
                key={i}
                className={''}
                onClick={onClick}
                disabled={disabled}
                testId={testId}
                text={label}
              />
            ),
        )}
      </div>
      <div>
        {dialogFooterRightButtons.map(
          ({ onClick, label, disabled, lazyAutoFocus, testId }, i) => (
            <ButtonSquare
              key={i}
              className={''}
              onClick={onClick}
              disabled={disabled}
              lazyAutoFocus={!isOnMobile ? lazyAutoFocus : 0}
              testId={testId}
              text={label}
            />
          ),
        )}
      </div>
    </footer>
  );
};

export { DialogFooter };
