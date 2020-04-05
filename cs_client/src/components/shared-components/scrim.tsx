import * as React from 'react';
import modOverlay from '::sass-modules/shared-components/overlay.scss';
import { EventHandler } from 'react';

type Props = {
  onClick: EventHandler<undefined>;
};

const Scrim: React.FC<Props> = ({ onClick }) => {
  return <div className={modOverlay.bodyScrim} onClick={onClick} />;
};

export { Scrim };
