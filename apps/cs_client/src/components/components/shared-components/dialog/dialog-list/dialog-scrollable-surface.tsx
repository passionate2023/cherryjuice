import * as React from 'react';
import mod from './dialog-scrollable-surface.scss';
type Props = {
  header?: JSX.Element;
};
const DialogScrollableSurface: React.FC<Props> = ({ header, children }) => {
  return (
    <div className={mod.dialogSurface}>
      {header}
      <div className={mod.dialogBody__scrollableSurface}>{children}</div>
    </div>
  );
};

export { DialogScrollableSurface };
