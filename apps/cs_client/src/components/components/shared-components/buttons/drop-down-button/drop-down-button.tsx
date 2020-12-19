import * as React from 'react';
import { modDropdownButton } from '::sass-modules';
import { useRef, useState } from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { Icon, Icons } from '@cherryjuice/icons';
import { useSelector } from 'react-redux';
import { Store } from '::store/store';

type Props = {
  buttons: { key: string; element: JSX.Element }[];
  collapseOnInsideClick?: boolean;
};

export const DropDownButton: React.FC<Props> = ({
  buttons,
  collapseOnInsideClick,
}) => {
  const md = useSelector<Store>(state => state.root.isOnMd);
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
  return (
    <div className={modDropdownButton.dropDownButton} {...clkOProps}>
      <div className={modDropdownButton.head}>
        {buttons[previouslySelected.current].element}
        <div onClick={toggleDropdown} className={modDropdownButton.head__arrow}>
          <Icon name={Icons.material['arrow-down']} size={14} />
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
            ) : (
              undefined
            ),
          )}
        </div>
      )}
    </div>
  );
};
