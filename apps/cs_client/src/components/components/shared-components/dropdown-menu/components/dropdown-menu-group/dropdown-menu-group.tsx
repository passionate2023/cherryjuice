import * as React from 'react';
import {
  DropdownMenuGroupHeader,
  DropdownMenuGroupHeaderProps,
} from '::shared-components/dropdown-menu/components/dropdown-menu-group/components/dropdown-menu-group-header';
import {
  DropdownMenuItem,
  DropdownMenuItemProps,
} from '::shared-components/dropdown-menu/components/dropdown-menu-group/components/dropdown-menu-item';
import { modDropdownMenu } from '::sass-modules';

export type DropdownMenuGroupProps = {
  id: string;
  header?: DropdownMenuGroupHeaderProps;
  body: JSX.Element | DropdownMenuItemProps[];
};

export const DropdownMenuGroup: React.FC<DropdownMenuGroupProps & {
  hide: () => void;
}> = ({ header, body, hide }) => {
  return (
    <div className={modDropdownMenu.dropdownMenu__group}>
      {header && <DropdownMenuGroupHeader {...header} />}
      <div className={modDropdownMenu.dropdownMenu__group__body}>
        {Array.isArray(body) ? (
          <div className={modDropdownMenu.dropdownMenu__group__items}>
            {body.map(item => (
              <DropdownMenuItem {...item} key={item.text} hide={hide} />
            ))}
          </div>
        ) : (
          body
        )}
      </div>
    </div>
  );
};
