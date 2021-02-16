import * as React from 'react';
import { modIconPicker } from '::sass-modules';
import { Icon } from '@cherryjuice/icons';
import { testIds } from '::cypress/support/helpers/test-ids';
import { IconsList } from '::root/components/app/components/menus/dialogs/node-meta/components/components/icons-list';
import { ContextMenuWrapper } from '@cherryjuice/components';
import { getNodeIconId } from '::app/components/editor/document/components/tree/components/node/components/node-icons/components/node-cherry';

type Props = { value: number; onChange; nodeDepth: number };

const IconPicker: React.FC<Props> = ({
  value: selectedIcon,
  onChange: setSelectedIcon,
  nodeDepth,
}) => {
  return (
    <ContextMenuWrapper
      clickOutsideSelectorsWhitelist={[
        {
          selector: '.' + modIconPicker.iconPicker__clear,
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
            onClick={show}
          >
            <Icon
              name={getNodeIconId(+selectedIcon, nodeDepth)}
              className={`${modIconPicker.iconPicker__icon} ${modIconPicker.iconPicker__iconCover}`}
              image={true}
            />
          </div>
        );
      }}
    </ContextMenuWrapper>
  );
};

export { IconPicker };
