import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';

type Props = {
  onButton1: EventHandler<undefined>;
  button1Label: string;
  button2Label: string;
};

const DialogFooter: React.FC<Props> = ({
  onButton1,
  button1Label,
  button2Label,
}) => {
  return (
    <footer className={`${modDialog.dialog__footer}`}>
      {/*<button*/}
      {/*  type="button"*/}
      {/*  className="mdc-button mdc-dialog__button"*/}
      {/*  onClick={onButton1}*/}
      {/*>*/}
      {/*  <div className="mdc-button__ripple" />*/}
      {/*  <span className="mdc-button__label">{button1Label}</span>*/}
      {/*</button>*/}
      <ButtonSquare className={''} onClick={onButton1}>
        {button1Label}
      </ButtonSquare>
      <ButtonSquare className={''} onClick={() => undefined} disabled={true}>
        {button2Label}
      </ButtonSquare>
      {/*<button type="button" className="mdc-button mdc-dialog__button">*/}
      {/*  <div className="mdc-button__ripple" />*/}
      {/*  <span className="mdc-button__label">{button2Label}</span>*/}
      {/*</button>*/}
    </footer>
  );
};

export { DialogFooter };
