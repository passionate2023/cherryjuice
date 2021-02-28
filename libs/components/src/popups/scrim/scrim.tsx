import * as React from 'react';
import modOverlay from './overlay.scss';
import { EventHandler } from 'react';

export type ScrimProps = {
  onClick: EventHandler<undefined>;
  alertModal?: boolean;
  isShownOnTopOfDialog?: boolean;
};

const Scrim: React.FC<ScrimProps> = ({
  onClick,
  alertModal,
  isShownOnTopOfDialog,
}) => {
  return (
    <div
      className={`${modOverlay.bodyScrim} ${
        alertModal ? modOverlay.bodyScrimAlertModal : ''
      } 
      ${isShownOnTopOfDialog ? modOverlay.bodyScrimOnTopOfDialog : ''}
      `}
      data-testid={'dialogs__scrim'}
      onClick={onClick}
    />
  );
};

export { Scrim };
