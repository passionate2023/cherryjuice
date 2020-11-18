import { modDialog } from '::sass-modules';
import * as React from 'react';
import { EventHandler } from 'react';
import {
  DialogFooter,
  TDialogFooterProps,
} from '::root/components/shared-components/dialog/dialog-footer';
import {
  DialogHeader,
  DialogHeaderProps,
} from '::root/components/shared-components/dialog/dialog-header';
import { DialogBody } from '::root/components/shared-components/dialog/dialog-body/dialog-body';
import { MeasurableDialogBody } from '::root/components/shared-components/dialog/dialog-body/measurable-dialog-body';
import { useModalKeyboardEvents } from '::hooks/modals/close-modal/use-modal-keyboard-events';
import { animated } from 'react-spring';
import { TransitionWrapper } from '::root/components/shared-components/transitions/transition-wrapper';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { joinClassNames } from '::helpers/dom/join-class-names';

type TDialogProps = {
  menuButton?: JSX.Element;
  dialogTitle?: string;
  onClose: EventHandler<undefined>;
  onConfirm?: EventHandler<undefined>;
  isOnMobile: boolean;
  small?: boolean;
  loading?: boolean;
  pinnable?: boolean;
  pinned?: boolean;
  measurable?: boolean;
} & TDialogFooterProps &
  DialogHeaderProps;

const Dialog: React.FC<TDialogProps & {
  style;
  show: boolean;
}> = ({
  children,
  menuButton,
  dialogTitle,
  onClose,
  onConfirm,
  footerLeftButtons,
  footRightButtons,
  style,
  isOnMobile,
  rightHeaderButtons,
  small,
  loading = false,
  pinned,
  pinnable,
  measurable,
  show,
}) => {
  const keyboardEventsProps = useModalKeyboardEvents({
    dismiss: onClose,
    confirm: onConfirm,
  });

  return (
    <>
      {
        <animated.div
          {...keyboardEventsProps}
          className={joinClassNames([
            modDialog.dialog,
            [modDialog.dialogSmall, small],
            [modDialog.dialogDocked, pinned],
          ])}
          style={{
            ...style,
            transform: style.xy.interpolate(
              (x, y) => `translate3d(${x}px,${y}px,0)`,
            ),
          }}
        >
          <LinearProgress loading={loading} />
          <DialogHeader
            menuButton={menuButton}
            dialogTitle={dialogTitle}
            onClose={onClose}
            rightHeaderButtons={rightHeaderButtons}
            pinnable={pinnable}
          />
          {measurable ? (
            <MeasurableDialogBody dialogBodyElements={children} />
          ) : (
            <DialogBody dialogBodyElements={children} />
          )}
          <DialogFooter
            footRightButtons={footRightButtons}
            footerLeftButtons={footerLeftButtons}
            isOnMobile={isOnMobile}
            pinned={pinnable && pinned}
            show={show}
          />
        </animated.div>
      }
    </>
  );
};

const DialogWithTransition: React.FC<TDialogProps & {
  show: boolean;
  isShownOnTopOfDialog?: boolean;
}> = ({ isShownOnTopOfDialog, ...props }) => {
  return (
    <TransitionWrapper<TDialogProps>
      Component={Dialog}
      show={props.show}
      transitionValues={{
        from: { opacity: 0, xy: [0, window.innerHeight * 0.7] },
        enter: { opacity: 1, xy: [0, 0] },
        leave: { opacity: 0.5, xy: [0, window.innerHeight * 1.1] },
        config: {
          tension: 170,
        },
      }}
      componentProps={props}
      scrimProps={
        props.pinnable && props.pinned
          ? undefined
          : { isShownOnTopOfDialog, onClick: props.onClose }
      }
    />
  );
};
export { Dialog, DialogWithTransition };
