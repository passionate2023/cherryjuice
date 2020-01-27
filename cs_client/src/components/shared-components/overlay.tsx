import * as React from 'react';
import modOverlay from '::sass-modules/overlay.scss';

type Props = {};

const Overlay: React.FC<Props> = ({}) => {
  return (
    <div className={modOverlay.selectFile__overlay} />
  );
};

export { Overlay };