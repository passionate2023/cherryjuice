import * as React from 'react';
import { modDropdownMenu } from '::sass-modules';
import {
  joinClassNames,
  useClickOutsideModal,
} from '@cherryjuice/shared-helpers';
import {
  DropdownMenuGroup,
  DropdownMenuGroupProps,
} from '::shared-components/dropdown-menu/components/dropdown-menu-group/dropdown-menu-group';
import { Assertion } from '@cherryjuice/shared-helpers/build/hooks/click-outside-modal';

type Props = {
  groups: DropdownMenuGroupProps[];
  hide: () => void;
  xOffset?: number;
  assertions?: Assertion[];
  showFromBottom?: boolean;
};
export const DropdownMenu: React.FC<Props> = ({
  assertions = [],
  xOffset,
  hide,
  groups,
  showFromBottom,
}) => {
  const { clkOProps } = useClickOutsideModal({
    assertions,
    callback: hide,
  });
  return (
    <div
      className={joinClassNames([
        modDropdownMenu.dropdownMenu,
        showFromBottom && modDropdownMenu.dropdownMenuShowFromBottom,
      ])}
      {...clkOProps}
      style={{ right: xOffset }}
    >
      {groups.map(group => (
        <DropdownMenuGroup {...group} key={group.id} hide={hide} />
      ))}
    </div>
  );
};
