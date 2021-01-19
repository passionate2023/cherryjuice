import * as React from 'react';
import { ac } from '::store/store';
import { useCallback, useRef, useEffect } from 'react';
import mod from './tab.scss';
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
  hidden?: boolean;
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
  hidden,
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
      setTimeout(() => {
        smoothScrollIntoView(tab.current);
      }, 50);
      if (isOnMd) scrollIntoToolbar();
    }
  }, [isSelected, isOnMd]);

  return (
    <div
      className={joinClassNames([
        mod.tab,
        [mod.tabSelected, isSelected],
        [mod.tabHidden, hidden],
      ])}
      data-id={node_id}
      onClick={selectNode}
      ref={tab}
    >
      <span
        className={joinClassNames([
          mod.tab__name,
          [mod.tabHasChanges, hasChanges],
          [mod.tabIsNew, isNew],
        ])}
      >
        {name}
      </span>
      <ButtonCircle
        iconName={Icons.material.close}
        onClick={closeNode}
        small={true}
        className={mod.tab__closeButton}
      />
      {isBookmarked && (
        <Icon
          name={Icons.material.bookmark}
          className={mod.tab__bookmarkIcon}
        />
      )}
    </div>
  );
};

export { Tab };
