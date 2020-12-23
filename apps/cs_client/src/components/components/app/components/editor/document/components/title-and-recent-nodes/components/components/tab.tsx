import * as React from 'react';
import { ac } from '::store/store';
import { useCallback, useRef, useEffect } from 'react';
import { modTabs } from '::sass-modules';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { ButtonCircle } from '@cherryjuice/components';
import { Icon, Icons } from '@cherryjuice/icons';
import { scrollIntoToolbar } from '::helpers/ui';
import { smoothScrollIntoView } from '@cherryjuice/shared-helpers';

export type NodeProps = {
  name: string;
  node_id: number;
  hasChanges?: boolean;
  isSelected?: boolean;
  isNew?: boolean;
  isBookmarked?: boolean;
};

type Props = {
  documentId: string;
  isOnMd?: boolean;
} & NodeProps;

const Tab: React.FC<Props> = ({
  name,
  node_id,
  documentId,
  isSelected,
  isOnMd,
  hasChanges,
  isNew,
  isBookmarked,
}) => {
  const selectNode = useCallback(() => {
    ac.node.select({ documentId, node_id });
  }, []);
  const closeNode = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    ac.node.close({ documentId, node_id });
  }, []);
  const tab = useRef<HTMLDivElement>();
  useEffect(() => {
    if (isSelected) {
      smoothScrollIntoView(tab.current);
      if (isOnMd) scrollIntoToolbar();
    }
  }, [isSelected]);

  return (
    <div
      className={joinClassNames([
        modTabs.tab,
        [modTabs.tabSelected, isSelected],
      ])}
      data-id={node_id}
      onClick={selectNode}
      ref={tab}
    >
      <span
        className={joinClassNames([
          modTabs.tab__name,
          [modTabs.tabHasChanges, hasChanges],
          [modTabs.tabIsNew, isNew],
        ])}
      >
        {name}
      </span>
      <ButtonCircle
        iconName={Icons.material.close}
        onClick={closeNode}
        small={true}
      />
      {isBookmarked && (
        <Icon
          name={Icons.material.bookmark}
          className={modTabs.tab__bookmarkIcon}
        />
      )}
    </div>
  );
};

export { Tab };
