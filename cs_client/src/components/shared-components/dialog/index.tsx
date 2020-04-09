import modDialog from '::sass-modules/shared-components/dialog.scss';
import * as React from 'react';
import { DialogFooter } from '::shared-components/dialog/dialog-footer';
import { DialogHeader } from '::shared-components/dialog/dialog-header';
import { DialogBody } from '::shared-components/dialog/dialog-body';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { EventHandler } from 'react';
import { animated } from 'react-spring';
import { TransitionWrapper } from '::shared-components/transition-wrapper';

type TDialogProps = {
  menuButton?: JSX.Element;
  dialogTitle?: string;
  onClose: EventHandler<any>;
  isOnMobile: boolean;
  dialogFooterButtons: {
    label: string | JSX.Element;
    disabled: boolean;
    onClick: EventHandler<any>;
  }[];
};

const Dialog: React.FC<TDialogProps & {
  style;
}> = ({
  children,
  menuButton,
  dialogTitle,
  onClose,
  dialogFooterButtons,
  style,
  isOnMobile,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onClose,
    modalSelector: `.${modDialog.dialog}`,
  });

  return (
    <>
      {
        <animated.div
          className={`${modDialog.dialog}`}
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
              onCloseDialog={onClose}
            />
          )}
          <DialogBody dialogBodyElements={children} />
          <DialogFooter
            dialogFooterButtons={dialogFooterButtons}
            isOnMobile={isOnMobile}
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
    <TransitionWrapper
      Component={Dialog}
      show={show}
      transitionValues={{
        from: { opacity: 0, xy: [0, 500] },
        enter: { opacity: 1, xy: [0, 0] },
        leave: { opacity: 0, xy: [0, 1000] },
      }}
      componentProps={props}
    />
  );
};
export { Dialog, DialogWithTransition };
