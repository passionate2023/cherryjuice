import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { EventHandler } from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { DialogHeaderButton } from '::root/components/shared-components/dialog/dialog-header';
export type TDialogFooterButton = {
  label: string;
  onClick: EventHandler<any>;
  component?: () => React.Component;
  disabled?: boolean;
  lazyAutoFocus?: number;
  testId?: string;
};
export type TDialogFooterProps = {
  isOnMobile: boolean;
  dialogFooterLeftButtons: TDialogFooterButton[];
  dialogFooterRightButtons: TDialogFooterButton[];
  docked?: boolean;
  rightHeaderButtons: DialogHeaderButton[];
};

const DialogFooter: React.FC<TDialogFooterProps> = ({
  dialogFooterRightButtons,
  dialogFooterLeftButtons,
  isOnMobile,
  docked,
  rightHeaderButtons,
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
        {docked ? (
          rightHeaderButtons.map(button =>
            button.hidden ? (
              <></>
            ) : (
              <ButtonSquare
                onClick={button.onClick}
                text={button.text}
                key={button.icon}
              />
            ),
          )
        ) : (
          <></>
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
