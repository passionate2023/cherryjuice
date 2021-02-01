import * as React from 'react';
import modDropdownButton from './drop-down-button.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { useClickOutsideModal } from '@cherryjuice/shared-helpers';
import { Icon } from '@cherryjuice/icons';

type Props = {
  buttons: { key: string; element: JSX.Element }[];
  collapseOnInsideClick?: boolean;
  md: boolean;
  onToggle?: (shown: boolean) => void;
};

export const DropDownButton: React.FC<Props> = ({
  buttons,
  collapseOnInsideClick,
  md,
  onToggle = () => undefined,
}) => {
  const previouslySelected = useRef(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(shown => !shown);
  const hideDropdownMenu = () => setShowDropdown(false);
  const selectButton = i => () => {
    if (collapseOnInsideClick) hideDropdownMenu();
    previouslySelected.current = i;
  };
  const { clkOProps } = useClickOutsideModal({
    assertions: [],
    callback: hideDropdownMenu,
  });
  useLayoutEffect(() => {
    onToggle(showDropdown);
  }, [showDropdown]);
  return (
    <div className={modDropdownButton.dropDownButton} {...clkOProps}>
      <div className={modDropdownButton.head}>
        {buttons[previouslySelected.current].element}
        <div onClick={toggleDropdown} className={modDropdownButton.head__arrow}>
          <Icon name={'arrow-down'} size={14} />
        </div>
      </div>
      {showDropdown && (
        <div
          className={modDropdownButton.list}
          style={{ top: md ? -((buttons.length - 1) * 40) : undefined }}
        >
          {buttons.map((button, i) =>
            i !== previouslySelected.current ? (
              <div
                key={button.key}
                onClick={selectButton(i)}
                className={modDropdownButton.list__item}
              >
                {button.element}
              </div>
            ) : undefined,
          )}
        </div>
      )}
    </div>
  );
};
