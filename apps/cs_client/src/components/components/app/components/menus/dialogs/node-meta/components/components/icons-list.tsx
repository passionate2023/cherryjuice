import { modIconPicker } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
import { Icon, Icons } from '@cherryjuice/icons';
import * as React from 'react';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';

const icons = [...Object.entries(Icons.cherrytree.custom_icons)];

export const IconsList = ({ selectedIcon, setSelectedIcon, hide, shown }) => {
  const keprops = useModalKeyboardEvents({
    dismiss: hide,
    focusableElementsSelector: ['.' + modIconPicker.iconPicker__icon],
  });
  return (
    <div
      className={`${modIconPicker.iconPicker__icon__list} ${
        !shown ? modIconPicker.iconPicker__icon__listHidden : ''
      }`}
      data-testid={testIds.nodeMeta__customIconList}
      {...keprops}
    >
      {icons.map(([iconId, iconName], i) => (
        <Icon
          name={iconName}
          className={`${modIconPicker.iconPicker__icon} ${
            selectedIcon === iconId
              ? modIconPicker.iconPicker__iconSelected
              : ''
          }`}
          key={i}
          onClick={() => {
            setSelectedIcon(iconId);
            hide();
          }}
          tabIndex={0}
          image={true}
        />
      ))}
    </div>
  );
};
