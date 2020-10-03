import * as React from 'react';
import { modDialog } from '::sass-modules';

type Props = {};

const DialogScrollableSurface: React.FC<Props> = ({ children }) => {
  return (
    <div className={modDialog.dialogSurface}>
      <div className={modDialog.dialogBody__scrollableSurface}>{children}</div>
    </div>
  );
};

export { DialogScrollableSurface };
