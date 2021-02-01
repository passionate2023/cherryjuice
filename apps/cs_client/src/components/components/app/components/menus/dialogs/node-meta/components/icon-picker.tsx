import * as React from 'react';
import { modIconPicker, modNodeMeta, modSearchFilter } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';
import { useState } from 'react';
import { testIds } from '::cypress/support/helpers/test-ids';
import { ContextMenuWrapperLegacy } from '::shared-components/context-menu/context-menu-wrapper-legacy';
import { IconsList } from '::root/components/app/components/menus/dialogs/node-meta/components/components/icons-list';

type Props = { value: string; disabled: boolean; onChange };

const IconPicker: React.FC<Props> = ({
  disabled,
  value: selectedIcon,
  onChange: setSelectedIcon,
}) => {
  const [shown, setShown] = useState(false);
  const show = () => setShown(true);
  const hide = () => setShown(false);
  const value = selectedIcon === '0' ? '1' : selectedIcon;

  return (
    <ContextMenuWrapperLegacy
      clickOutsideSelectorsWhitelist={[
        {
          selector: '.' + modSearchFilter.searchFilter,
        },
      ]}
      showAsModal={'mb'}
      shown={shown}
      hide={hide}
      show={show}
      customBody={
        <IconsList
          {...{
            selectedIcon,
            setSelectedIcon,
            hide,
            shown,
          }}
        />
      }
    >
      <div
        className={modIconPicker.iconPicker}
        data-testid={testIds.nodeMeta__customIcon}
      >
        <Icon
          name={Icons.cherrytree.custom_icons[value]}
          className={`${modIconPicker.iconPicker__icon} ${
            disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
          }`}
          onClick={() => !disabled && setShown(shown => !shown)}
          image={true}
        />
      </div>
    </ContextMenuWrapperLegacy>
  );
};

export { IconPicker };
