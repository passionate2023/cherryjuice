import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { ReactNode } from 'react';

type Props = { dialogBodyElements: ReactNode };

const DialogBody: React.FC<Props> = ({ dialogBodyElements }) => {
  return (
    <div className={`${modDialog.dialog__content}`}>{dialogBodyElements}</div>
  );
};

export { DialogBody };
