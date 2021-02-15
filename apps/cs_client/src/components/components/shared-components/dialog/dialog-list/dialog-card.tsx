import * as React from 'react';
import mod from './dialog-card.scss';
import { memo } from 'react';

type DialogCardProps = {
  items: JSX.Element[];
  name?: string;
};
const DialogCard = ({ name, items }: DialogCardProps) => {
  return (
    <div className={mod.dialogCard}>
      {name && <span className={mod.dialogCard__name}>{name}</span>}
      <span className={mod.dialogCard__items}>{items}</span>
    </div>
  );
};

const M = memo(DialogCard);
export { M as DialogCard };
