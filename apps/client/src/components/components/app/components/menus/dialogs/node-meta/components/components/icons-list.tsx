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
      {icons.map(([iconId, iconName], i) => {
        const isSelected = +selectedIcon === +iconId;
        return (
          <span
            className={`${modIconPicker.iconPicker__icon} ${
              isSelected ? modIconPicker.iconPicker__iconSelected : ''
            }`}
            key={i}
            onClick={() => {
              setSelectedIcon(isSelected ? 0 : iconId);
            }}
          >
            <Icon name={iconName} tabIndex={0} image={true} />
            {isSelected && (
              <Icon
                name={'clear'}
                tabIndex={0}
                image={true}
                className={modIconPicker.iconPicker__clear}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};
