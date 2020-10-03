import * as React from 'react';
import { modDialog } from '::sass-modules';

type DialogCardProps = {
  items: JSX.Element[];
  name?: string;
};
const DialogCard = ({ name, items }: DialogCardProps) => {
  return (
    <div className={modDialog.dialogCard}>
      {name && <span className={modDialog.dialogCard__name}>{name}</span>}
      <span className={modDialog.dialogCard__items}>{items}</span>
    </div>
  );
};

export { DialogCard };
