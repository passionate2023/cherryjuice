import * as React from 'react';
import mod from './dialog-content.scss';

const DialogBody: React.FC = ({ children }) => {
  return <div className={`${mod.dialog__content}`}>{children}</div>;
};
export { DialogBody };
