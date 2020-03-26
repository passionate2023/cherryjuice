import modDialog from '::sass-modules/shared-components/dialog.scss';
import * as React from 'react';
import { EventHandler } from 'react';
import { DialogFooter } from '::shared-components/material/dialog/dialog-footer';
import { DialogHeader } from '::shared-components/material/dialog/dialog-header';
import { DialogBody } from '::shared-components/material/dialog/dialog-body';
import { Scrim } from '::shared-components/scrim';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';

const Dialog: React.FC<{
  menuButton?: JSX.Element;
  dialogTitle?: string;
  onCloseDialog: EventHandler<any>;
  dialogFooterButtons: {
    label: string | JSX.Element;
    disabled: boolean;
    onClick: EventHandler<any>;
  }[];
}> = ({
  children,
  menuButton,
  dialogTitle,
  onCloseDialog,
  dialogFooterButtons,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onCloseDialog,
    modalSelector: `.${modDialog.dialog__container}`,
  });

  return (
    <div className={modDialog.dialog__container}>
      <Scrim onClick={onCloseDialog} />
      <div className={`${modDialog.dialog}`}>
        {dialogTitle && (
          <DialogHeader
            menuButton={menuButton}
            dialogTitle={dialogTitle}
            onCloseDialog={onCloseDialog}
          />
        )}
        <DialogBody dialogBodyElements={children} />
        <DialogFooter dialogFooterButtons={dialogFooterButtons} />
      </div>
    </div>
  );
};

export { Dialog };
