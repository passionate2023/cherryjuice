import * as React from 'react';
import { EventHandler, memo } from 'react';
import { ButtonSquare } from '@cherryjuice/components';
import { ac } from '::store/store';
import mod from './dialog-footer.scss';
export type TDialogFooterButton = {
  label: string;
  onClick: EventHandler<any>;
  component?: () => React.Component;
  disabled?: boolean;
  lazyAutoFocus?: boolean;
  testId?: string;
};
export type TDialogFooterProps = {
  footerLeftButtons?: TDialogFooterButton[];
  footRightButtons?: TDialogFooterButton[];
  isOnMobile: boolean;
  pinned?: boolean;
  show: boolean;
};

const DialogFooter: React.FC<TDialogFooterProps> = ({
  footRightButtons = [],
  footerLeftButtons = [],
  isOnMobile,
  pinned,
  show,
}) => {
  return (
    <footer className={`${mod.dialog__footer}`}>
      <div>
        {pinned ? (
          <ButtonSquare
            onClick={ac.root.toggleDockedDialog}
            text={pinned ? 'unpin' : 'pin'}
          />
        ) : (
          footerLeftButtons.map(
            ({ component, onClick, label, disabled, testId }, i) =>
              component ? (
                component()
              ) : (
                <ButtonSquare
                  key={i}
                  onClick={onClick}
                  disabled={disabled}
                  testId={testId}
                  text={label}
                />
              ),
          )
        )}
      </div>
      <div>
        {footRightButtons.map(
          ({ onClick, label, disabled, lazyAutoFocus, testId }, i) => (
            <ButtonSquare
              key={i}
              onClick={onClick}
              disabled={disabled}
              lazyAutoFocus={lazyAutoFocus && !isOnMobile && show}
              testId={testId}
              text={label}
            />
          ),
        )}
      </div>
    </footer>
  );
};
const M = memo(DialogFooter);
export { M as DialogFooter };
