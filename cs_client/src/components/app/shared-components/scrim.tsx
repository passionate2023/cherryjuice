import * as React from 'react';
import modOverlay from '::sass-modules/shared-components/overlay.scss';
import { EventHandler } from 'react';
import { testIds } from '::cypress/support/helpers/test-ids';

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
      data-testid={testIds.dialogs__scrim}
      onClick={onClick}
    />
  );
};

export { Scrim };
