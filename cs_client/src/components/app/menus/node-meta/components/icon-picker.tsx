import * as React from 'react';
import { modIconPicker, modNodeMeta } from '::sass-modules/index';
import { Icon, ICON_GROUP, Icons } from '::shared-components/icon';
import { useState } from 'react';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { testIds } from '::cypress/index';

const icons = [...Object.entries(Icons.cherrytree.custom_icons)];

const IconsList = ({
  selectedIcon,
  setSelectedIcon,
  setShowList,
  showList,
}) => {
  useClickOutsideModal({
    cb: () => setShowList(false),
    selectorsToIgnore: [
      modIconPicker.iconPicker__icon,
      modIconPicker.iconPicker__icon__list,
      modIconPicker.iconPicker,
    ],
    isVisible: showList,
  });

  return (
    <div
      className={`${modIconPicker.iconPicker__icon__list} ${
        !showList ? modIconPicker.iconPicker__icon__listHidden : ''
      }`}
      data-testid={testIds.nodeMeta__customIconList}
    >
      {icons.map(([iconId, iconName], i) => (
        <Icon
          name={iconName}
          key={i}
          className={`${modIconPicker.iconPicker__icon} ${
            selectedIcon === iconId
              ? modIconPicker.iconPicker__iconSelected
              : ''
          }`}
          group={ICON_GROUP.cherrytree}
          onClick={() => {
            setSelectedIcon(iconId);
            setShowList(false);
          }}
        />
      ))}
    </div>
  );
};

type Props = { value: string; disabled: boolean; onChange };

const IconPicker: React.FC<Props> = ({
  value: selectedIcon,
  disabled,
  onChange: setSelectedIcon,
}) => {
  const [showList, setShowList] = useState(false);
  const value = selectedIcon === '0' ? '1' : selectedIcon;
  return (
    <div
      className={modIconPicker.iconPicker}
      data-testid={testIds.nodeMeta__customIcon}
    >
      <Icon
        name={Icons.cherrytree.custom_icons[value]}
        className={`${modIconPicker.iconPicker__icon} ${
          disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
        }`}
        group={ICON_GROUP.cherrytree}
        onClick={() => !disabled && setShowList(!showList)}
      />
      {showList && (
        <IconsList
          {...{
            selectedIcon,
            setSelectedIcon,
            setShowList,
            showList,
          }}
        />
      )}
    </div>
  );
};

export { IconPicker };
