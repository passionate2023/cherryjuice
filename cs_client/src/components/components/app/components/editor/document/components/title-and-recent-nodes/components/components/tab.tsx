import * as React from 'react';
import { ac } from '::store/store';
import { useCallback, useRef, useEffect } from 'react';
import { modTabs, modToolbar } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';

type Props = {
  name: string;
  node_id: number;
  documentId: string;
  isSelected?: boolean;
  isOnMd?: boolean;
};

const Tab: React.FC<Props> = ({
  name,
  node_id,
  documentId,
  isSelected,
  isOnMd,
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
      tab.current.scrollIntoView();
      if (isOnMd)
        document.querySelector('.' + modToolbar.toolBar).scrollIntoView();
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
      <span className={modTabs.tab__name}>{name}</span>
      <ButtonCircle
        className={modTabs.tab__button}
        icon={<Icon name={Icons.material.close} size={12} />}
        onClick={closeNode}
      />
    </div>
  );
};

export { Tab };
