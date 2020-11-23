import * as React from 'react';
import { modTabs } from '::sass-modules';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Tabs } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/tabs';
import { useRef, useState } from 'react';
import {
  clampTabs,
  getNumberOfVisibleTabs,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/helpers/clamp-tabs/clamp-tabs';
import { HiddenTabs } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/hidden-tabs';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { useTabsMenuItems } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/hooks/tabs-menu-items';
import { useChildContextMenu } from '::root/components/shared-components/context-menu/hooks/child-context-menu';
import { createNodePropsMapper } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/helpers/map-props';
import { useForceUpdate } from '::hooks/react/force-update';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    localState: document.localState,
    nodes: document?.nodes,
    isOnMd: state.root.isOnMd,
    vw: state.cssVariables.vw,
    treeWidth: state.cssVariables.treeWidth,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    recentNodes: document?.persistedState?.recentNodes,
    bookmarks: document?.persistedState?.bookmarks,
    documentId: document?.id,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const TabsContainer: React.FC<Props & PropsFromRedux> = ({
  nodes,
  selectedNode_id,
  recentNodes,
  documentId,
  isOnMd,
  localState,
  treeWidth,
  bookmarks,
}) => {
  useForceUpdate();
  const [showHiddenTabs, setShowHiddenTabs] = useState(false);

  const tabsR = useRef<HTMLDivElement>();

  let visible: number[], hidden: number[];
  if (isOnMd) {
    visible = recentNodes;
    hidden = [];
  } else {
    const numberOfVisibleTabs = Math.ceil(
      getNumberOfVisibleTabs(window.innerWidth - treeWidth) - 0.2,
    );
    [visible, hidden] = clampTabs(
      recentNodes,
      selectedNode_id,
      numberOfVisibleTabs,
    );
  }

  const [activeTab, setActiveTab] = useState<number>();

  const { position, show, hide, shown } = useChildContextMenu({
    onSelectElement: id => setActiveTab(+id),
    getIdOfActiveElement: target =>
      target.dataset.id || target.parentElement.dataset.id,
  });
  const tabContextMenuOptions = useTabsMenuItems({
    documentId,
    activeTab,
    recentNodes,
    hide,
    nodes,
    localState,
    bookmarks,
  });

  const mapNodeProps = createNodePropsMapper(
    nodes,
    localState,
    selectedNode_id,
    new Set(bookmarks),
  );
  return (
    <div className={modTabs.tabsContainer} onContextMenu={show}>
      <ContextMenuWrapper
        shown={shown}
        hide={hide}
        items={tabContextMenuOptions}
        position={position}
      >
        <Tabs
          documentId={documentId}
          nodes={visible.map(mapNodeProps)}
          ref={tabsR}
          isOnMd={isOnMd}
        />
      </ContextMenuWrapper>

      {!!hidden.length && (
        <HiddenTabs
          documentId={documentId}
          nodes={hidden.map(mapNodeProps)}
          hideContextMenu={() => setShowHiddenTabs(false)}
          showContextMenu={() => setShowHiddenTabs(true)}
          shown={showHiddenTabs}
        />
      )}
    </div>
  );
};

const _ = connector(TabsContainer);
export { _ as TabsContainer };
