import * as React from 'react';
import { modDropdownMenu } from '::sass-modules';

export type DropdownMenuGroupHeaderProps = {
  text?: string;
};

export const DropdownMenuGroupHeader: React.FC<DropdownMenuGroupHeaderProps> = ({
  text,
}) => {
  return (
    <div className={modDropdownMenu.dropdownMenu__group__header}>
      {text && (
        <div className={modDropdownMenu.dropdownMenu__group__header__name}>
          {text}
        </div>
      )}
    </div>
  );
};
