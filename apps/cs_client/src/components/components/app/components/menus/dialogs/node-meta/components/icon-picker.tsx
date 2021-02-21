import * as React from 'react';
import { modIconPicker } from '::sass-modules';
import { Icon, IconName } from '@cherryjuice/icons';
import { testIds } from '::cypress/support/helpers/test-ids';
import { IconsList } from '::root/components/app/components/menus/dialogs/node-meta/components/components/icons-list';
import { ContextMenuWrapper } from '@cherryjuice/components';
import { getNodeIconId } from '::app/components/editor/document/components/tree/components/node/components/node-icons/components/node-cherry';
import { useRef } from 'react';
import { useOnKeyPress } from '@cherryjuice/shared-helpers';

const IconButton: React.FC<{ show: () => void; icon: IconName }> = ({
  show,
  icon,
}) => {
  const ref = useRef();
  useOnKeyPress({ ref, onClick: show, keys: ['Space', 'Enter'] });
  return (
    <div
      className={modIconPicker.iconPicker}
      data-testid={testIds.nodeMeta__customIcon}
      onClick={show}
      ref={ref}
      tabIndex={0}
      data-focusable={'self'}
    >
      <Icon
        name={icon}
        className={`${modIconPicker.iconPicker__icon} ${modIconPicker.iconPicker__iconCover}`}
        image={true}
      />
    </div>
  );
};

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
      {({ show }) => (
        <IconButton
          show={show}
          icon={getNodeIconId(+selectedIcon, nodeDepth)}
        />
      )}
    </ContextMenuWrapper>
  );
};

export { IconPicker };
