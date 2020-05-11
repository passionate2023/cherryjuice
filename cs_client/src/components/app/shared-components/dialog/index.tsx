import { modDialog } from '::sass-modules/index';
import * as React from 'react';
import {
  DialogFooter,
  TDialogFooterProps,
} from '::shared-components/dialog/dialog-footer';
import {
  DialogHeader,
  DialogHeaderProps,
} from '::shared-components/dialog/dialog-header';
import { DialogBody } from '::shared-components/dialog/dialog-body';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { EventHandler } from 'react';
import { animated } from 'react-spring';
import { TransitionWrapper } from '::shared-components/transition-wrapper';

type TDialogProps = {
  menuButton?: JSX.Element;
  dialogTitle?: string;
  onClose: EventHandler<undefined>;
  isOnMobile: boolean;
  small: boolean;
  lazyAutoFocus?: number;
} & TDialogFooterProps &
  DialogHeaderProps;

const Dialog: React.FC<TDialogProps & {
  style;
}> = ({
  children,
  menuButton,
  dialogTitle,
  onClose,
  dialogFooterLeftButtons,
  dialogFooterRightButtons,
  style,
  isOnMobile,
  rightHeaderButtons,
  small,
  lazyAutoFocus,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onClose,
    modalSelector: `.${modDialog.dialog}`,
  });

  return (
    <>
      {
        <animated.div
          className={`${modDialog.dialog} ${
            small ? modDialog.dialogSmall : ''
          }`}
          style={{
            ...style,
            transform: style.xy.interpolate(
              (x, y) => `translate3d(${x}px,${y}px,0)`,
            ),
          }}
        >
          {dialogTitle && (
            <DialogHeader
              menuButton={menuButton}
              dialogTitle={dialogTitle}
              onClose={onClose}
              rightHeaderButtons={rightHeaderButtons}
            />
          )}
          <DialogBody dialogBodyElements={children} />
          <DialogFooter
            dialogFooterRightButtons={dialogFooterRightButtons}
            dialogFooterLeftButtons={dialogFooterLeftButtons}
            isOnMobile={isOnMobile}
            lazyAutoFocus={lazyAutoFocus}
          />
        </animated.div>
      }
    </>
  );
};

const DialogWithTransition: React.FC<TDialogProps & { show: boolean }> = ({
  show,
  ...props
}) => {
  return (
    <TransitionWrapper<TDialogProps>
      Component={Dialog}
      show={show}
      transitionValues={{
        from: { opacity: 0, xy: [0, window.innerHeight * 0.7] },
        enter: { opacity: 1, xy: [0, 0] },
        leave: { opacity: 0.5, xy: [0, window.innerHeight * 1.1] },
        config: {
          tension: 170,
        },
      }}
      componentProps={props}
      scrimProps={{ onClick: props.onClose }}
    />
  );
};
export { Dialog, DialogWithTransition };
