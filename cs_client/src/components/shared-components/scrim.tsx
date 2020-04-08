import * as React from 'react';
import modOverlay from '::sass-modules/shared-components/overlay.scss';
import { EventHandler } from 'react';

type Props = {
  onClick: EventHandler<undefined>;
  errorModal?: boolean;
};

const Scrim: React.FC<Props> = ({ onClick, errorModal }) => {
  return (
    <div
      className={`${modOverlay.bodyScrim} ${
        errorModal ? modOverlay.bodyScrimErrorModal : ''
      }`}
      onClick={onClick}
    />
  );
};

export { Scrim };
