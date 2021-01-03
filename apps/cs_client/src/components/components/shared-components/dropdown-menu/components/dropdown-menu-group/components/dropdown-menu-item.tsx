import * as React from 'react';
import { modDropdownMenu } from '::sass-modules';

export type DropdownMenuItemProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
};

export const DropdownMenuItem: React.FC<
  DropdownMenuItemProps & {
    hide: () => void;
  }
> = ({ text, onClick, hide, testId, disabled }) => {
  const _onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    hide();
    onClick();
  };
  return (
    <span
      className={modDropdownMenu.dropdownMenu__group__item}
      onClick={disabled ? undefined : _onClick}
      data-testid={testId}
      data-disabled={disabled}
    >
      {text}
    </span>
  );
};
