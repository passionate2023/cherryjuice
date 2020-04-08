import modDialog from '::sass-modules/shared-components/dialog.scss';
import * as React from 'react';
import { DialogFooter } from '::shared-components/dialog/dialog-footer';
import { DialogHeader } from '::shared-components/dialog/dialog-header';
import { DialogBody } from '::shared-components/dialog/dialog-body';
import { Scrim } from '::shared-components/scrim';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { EventHandler } from 'react';
import { animated, useTransition } from 'react-spring';

type TDialogProps = {
  menuButton?: JSX.Element;
  dialogTitle?: string;
  onCloseDialog: EventHandler<any>;
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
  onCloseDialog,
  dialogFooterButtons,
  style,
  isOnMobile,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onCloseDialog,
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
              onCloseDialog={onCloseDialog}
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

const DialogWrapper: React.FC<TDialogProps & {
  showDialog: boolean;
}> = ({ showDialog, ...props }) => {
  // @ts-ignore
  const transitions = useTransition(showDialog, null, {
    from: { opacity: 0, xy: [0, 500] },
    enter: { opacity: 1, xy: [0, 0] },
    leave: { opacity: 0, xy: [0, 1000] },
  });
  return (
    <>
      {showDialog && <Scrim onClick={props.onCloseDialog} />}
      {transitions.map(
        ({ key, item, props: style }) =>
          item && <Dialog {...props} style={style} key={key} />,
      )}
    </>
  );
};

export { Dialog, DialogWrapper };
