import * as React from 'react';
import { ac } from '::store/store';
import { useCallback, useRef, useEffect } from 'react';
import { modTabs } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { scrollIntoToolbar } from '::helpers/ui';
const defaultScrollOptions: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'nearest',
  inline: 'start',
};
export const smoothScrollIntoView = (
  element: Element,
  options: Partial<ScrollIntoViewOptions> = defaultScrollOptions,
) => {
  element.scrollIntoView(options);
};

export type NodeProps = {
  name: string;
  node_id: number;
  hasChanges?: boolean;
  isSelected?: boolean;
  isNew?: boolean;
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
        className={modTabs.tab__button}
        icon={<Icon name={Icons.material.close} size={12} />}
        onClick={closeNode}
      />
    </div>
  );
};

export { Tab };
