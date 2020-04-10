import * as React from 'react';
import modOverlay from '::sass-modules/shared-components/overlay.scss';
import { EventHandler } from 'react';

export type ScrimProps = {
  onClick: EventHandler<undefined>;
  alertModal?: boolean;
};

const Scrim: React.FC<ScrimProps> = ({ onClick, alertModal }) => {
  return (
    <div
      className={`${modOverlay.bodyScrim} ${
        alertModal ? modOverlay.bodyScrimAlertModal : ''
      }`}
      onClick={onClick}
    />
  );
};

export { Scrim };
