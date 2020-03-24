import modDialog from '::sass-modules/shared-components/dialog.scss';
import * as React from 'react';
import { EventHandler } from 'react';
import { DialogFooter } from '::shared-components/material/dialog/dialog-footer';
import { DialogHeader } from '::shared-components/material/dialog/dialog-header';
import { DialogBody } from '::shared-components/material/dialog/dialog-body';
import { Scrim } from '::shared-components/scrim';

const Dialog: React.FC<{
  dialogTitle: string;
  button1: string;
  button2: string;
  onButton1: EventHandler<any>;
  onOverlay: EventHandler<any>;
}> = ({ onOverlay, children, dialogTitle, button1, button2, onButton1 }) => (
  <>
    <Scrim onClick={onOverlay} />
    <div className={`${modDialog.dialog}`}>
      <DialogHeader dialogTitle={dialogTitle} onButton1={onButton1} />
      <DialogBody dialogBodyElements={children} />
      <DialogFooter
        button1Label={button1}
        button2Label={button2}
        onButton1={onButton1}
      />
    </div>
  </>
);

export { Dialog };
