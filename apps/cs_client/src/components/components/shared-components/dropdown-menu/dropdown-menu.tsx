import * as React from 'react';
import { modDropdownMenu } from '::sass-modules';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import {
  DropdownMenuGroup,
  DropdownMenuGroupProps,
} from '::shared-components/dropdown-menu/components/dropdown-menu-group/dropdown-menu-group';

type Props = {
  groups: DropdownMenuGroupProps[];
  hide: () => void;
  xOffset?: number;
};
export const DropdownMenu: React.FC<Props> = ({ xOffset, hide, groups }) => {
  const { clkOProps } = useClickOutsideModal({
    assertions: [],
    callback: hide,
  });
  return (
    <div
      className={modDropdownMenu.dropdownMenu}
      {...clkOProps}
      style={{ right: xOffset }}
    >
      {groups.map(group => (
        <DropdownMenuGroup {...group} key={group.id} hide={hide} />
      ))}
    </div>
  );
};
