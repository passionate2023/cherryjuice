import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { EventHandler } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';

type Props = {
  itemName: string;
  onClick: EventHandler<any>;
  disabled?: boolean;
};

const PopupItem: React.FC<Props> = ({ itemName, onClick, disabled }) => {
  return (
    <div
      className={joinClassNames([
        modSelectFile.selectFile__file__threeDotsPopup__item,
        [
          modSelectFile.selectFile__file__threeDotsPopup__itemDisabled,
          disabled,
        ],
      ])}
      onClick={disabled ? undefined : onClick}
      {...(disabled && { 'data-disabled': disabled })}
    >
      {itemName}
    </div>
  );
};

export { PopupItem };
