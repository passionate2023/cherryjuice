import { modIconPicker } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
import { Icon, Icons } from '@cherryjuice/icons';
import * as React from 'react';

const icons = [...Object.entries(Icons.cherrytree.custom_icons)];

export const IconsList = ({ selectedIcon, setSelectedIcon }) => {
  return (
    <div
      className={`${modIconPicker.iconPicker__icon__list} `}
      data-testid={testIds.nodeMeta__customIconList}
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
          }}
          tabIndex={0}
          image={true}
        />
      ))}
    </div>
  );
};
