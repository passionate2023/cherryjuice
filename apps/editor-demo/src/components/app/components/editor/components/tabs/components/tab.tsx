import * as React from 'react';
import { useCallback, useRef } from 'react';
import { modTabs } from '::sass-modules';
import { joinClassNames } from '::helpers/join-class-names';
import { Icon, Icons } from '@cherryjuice/icons';
import { editorAC } from '::root/app/components/editor/reducer';

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
  isSelected,
  hasChanges,
  isNew,
  isBookmarked,
}) => {
  const selectNode = useCallback(() => {
    editorAC.selectNode(node_id);
  }, []);
  const tab = useRef<HTMLDivElement>();

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
