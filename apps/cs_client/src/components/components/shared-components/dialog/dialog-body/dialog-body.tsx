import * as React from 'react';
import { memo, ReactNode } from 'react';
import { modDialog } from '::sass-modules';

type Props = { dialogBodyElements: ReactNode };

const DialogBody: React.FC<Props> = ({ dialogBodyElements }) => {
  return (
    <div className={`${modDialog.dialog__content}`}>{dialogBodyElements}</div>
  );
};
const M = memo(DialogBody);
export { M as DialogBody };
