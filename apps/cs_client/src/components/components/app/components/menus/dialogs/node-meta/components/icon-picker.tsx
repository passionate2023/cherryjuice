import * as React from 'react';
import { modIconPicker, modNodeMeta, modSearchFilter } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';
import { testIds } from '::cypress/support/helpers/test-ids';
import { IconsList } from '::root/components/app/components/menus/dialogs/node-meta/components/components/icons-list';
import { ContextMenuWrapper } from '@cherryjuice/components';

type Props = { value: string; disabled: boolean; onChange };

const IconPicker: React.FC<Props> = ({
  disabled,
  value: selectedIcon,
  onChange: setSelectedIcon,
}) => {
  const value = selectedIcon === '0' ? '1' : selectedIcon;

  return (
    <ContextMenuWrapper
      clickOutsideSelectorsWhitelist={[
        {
          selector: '.' + modSearchFilter.searchFilter,
        },
      ]}
      showAsModal={'mb'}
      hookProps={{
        getActiveElement: () =>
          document.querySelector(
            `[data-testid=${testIds.nodeMeta__customIcon}]`,
          ),
        getIdOfActiveElement: () => 'icon-picker',
      }}
      positionPreferences={{
        positionX: 'rl',
        positionY: 'tt',
        offsetX: 0,
        offsetY: 0,
      }}
      customBody={
        <IconsList
          {...{
            selectedIcon,
            setSelectedIcon,
          }}
        />
      }
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      {({ show }) => {
        return (
          <div
            className={modIconPicker.iconPicker}
            data-testid={testIds.nodeMeta__customIcon}
            onClick={disabled ? undefined : show}
          >
            <Icon
              name={Icons.cherrytree.custom_icons[value]}
              className={`${modIconPicker.iconPicker__icon} ${
                disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
              }`}
              image={true}
            />
          </div>
        );
      }}
    </ContextMenuWrapper>
  );
};

export { IconPicker };
