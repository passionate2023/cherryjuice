import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { EventHandler } from 'react';

type Props = {
  itemName: string;
  onClick: EventHandler<any>;
};

const PopupItem: React.FC<Props> = ({ itemName, onClick }) => {
  return (
    <div
      className={modSelectFile.selectFile__file__threeDotsPopup__item}
      onClick={onClick}
    >
      {itemName}
    </div>
  );
};

export { PopupItem };
