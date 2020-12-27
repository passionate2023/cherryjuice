import * as React from 'react';
import modBoard from './board.scss';
type Props = {};

const HBoard: React.FC<Props> = ({ children }) => {
  return <div className={modBoard.hBoard}>{children}</div>;
};
const VBoard: React.FC<Props> = ({ children }) => {
  return <div className={modBoard.vBoard}>{children}</div>;
};

const Grid: React.FC<Props> = ({ children }) => {
  return <div className={modBoard.grid}>{children}</div>;
};
export { HBoard, VBoard, Grid };
