import * as React from 'react';
import { modDropdownMenu } from '::sass-modules';
import { Icon, IconName } from '@cherryjuice/icons';

export type DropdownMenuItemProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
  hideOnClick?: boolean;
  icon?: IconName;
};

export const DropdownMenuItem: React.FC<
  DropdownMenuItemProps & {
    hide: () => void;
  }
> = ({ text, onClick, hide, testId, disabled, hideOnClick = true, icon }) => {
  const _onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (hideOnClick) hide();
    onClick();
  };
  return (
    <span
      className={modDropdownMenu.dropdownMenu__group__item}
      onClick={disabled ? undefined : _onClick}
      data-testid={testId}
      data-disabled={disabled}
    >
      <span>{text}</span>
      {icon && (
        <span className={modDropdownMenu.dropdownMenu__group__item__icon}>
          <Icon name={icon} size={16} />
        </span>
      )}
    </span>
  );
};
