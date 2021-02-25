import mod from './dialog.scss';
import * as React from 'react';
import { memo } from 'react';
import {
  DialogFooter,
  TDialogFooterProps,
} from '::root/components/shared-components/dialog/dialog-footer';
import {
  DialogHeader,
  DialogHeaderProps,
} from '::root/components/shared-components/dialog/dialog-header';
import { DialogBody } from '::root/components/shared-components/dialog/dialog-body/dialog-body';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';
import { animated } from 'react-spring';
import { TransitionWrapper } from '::root/components/shared-components/transitions/transition-wrapper';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { transitions } from '::shared-components/transitions/transitions';

type TDialogProps = {
  menuButton?: JSX.Element;
  dialogTitle?: string;
  onClose: () => void;
  onConfirm?: () => void;
  isOnMobile: boolean;
  small?: boolean;
  loading?: boolean;
  pinnable?: boolean;
  pinned?: boolean;
} & TDialogFooterProps &
  DialogHeaderProps;

const Dialog: React.FC<
  TDialogProps & {
    style;
    show: boolean;
  }
> = ({
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
            mod.dialog,
            [mod.dialogSmall, small],
            [mod.dialogDocked, pinned],
            [mod.dialogDockedAndShown, pinned && show],
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
            pinned={pinned}
          />
          <DialogBody>{children} </DialogBody>
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

const M = memo(Dialog);

const DialogWithTransition: React.FC<
  TDialogProps & {
    show: boolean;
    isShownOnTopOfDialog?: boolean;
  }
> = ({ isShownOnTopOfDialog, ...props }) => {
  return (
    <TransitionWrapper<TDialogProps>
      Component={M}
      show={props.show}
      transitionValues={transitions.t3}
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
export { mod as modDialog };
