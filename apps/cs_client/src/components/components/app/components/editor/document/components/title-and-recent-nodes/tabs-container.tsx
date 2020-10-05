import * as React from 'react';
import { modTabs } from '::sass-modules';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Tabs } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/tabs';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clampTabs,
  getNumberOfVisibleTabs,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/helpers/clamp-tabs/clamp-tabs';
import { HiddenTabs } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/hidden-tabs';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { useTabContextMenu } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/hooks/tab-context-menu';
import {
  CachedDocumentState,
  NodesDict,
} from '::store/ducks/cache/document-cache';
import { NodeProps } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';
import { newNodePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

export const createNodePropsMapper = (
  nodes: NodesDict,
  localState: CachedDocumentState,
  selectedNode_id,
  bookmarks?: Set<number>,
) => (node_id: number): NodeProps => {
  const node = nodes[node_id];
  return {
    node_id,
    name: node?.name || '?',
    hasChanges: !!localState.editedNodes.edited[node_id],
    isSelected: selectedNode_id === node_id,
    isNew: node?.id?.startsWith(newNodePrefix),
    isBookmarked: bookmarks && bookmarks.has(node_id),
  };
};

export const useChildCM = () => {
  const [CMOffset, setCMOffset] = useState<[number, number]>([0, 0]);
  const [focusedNode_id, setFocusedNode_id] = useState(0);
  const onContextMenu = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const focusedNode_id = target.dataset.id || target.parentElement.dataset.id;
    if (focusedNode_id) {
      setFocusedNode_id(+focusedNode_id);
      setCMOffset([e.clientX, e.clientY]);
    }
  }, []);

  const hide = () => setCMOffset([0, 0]);
  const shown = CMOffset[0] > 0;

  return {
    onContextMenu,
    shown,
    hide,
    elementId: focusedNode_id,
    position: CMOffset,
  };
};

const useForceUpdate = () => {
  const [, setFoo] = useState(0);
  useEffect(() => {
    setFoo(1);
  }, []);
};

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

  const { elementId, position, onContextMenu, hide, shown } = useChildCM();
  const tabContextMenuOptions = useTabContextMenu({
    documentId,
    elementId,
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
    <div className={modTabs.tabsContainer} onContextMenu={onContextMenu}>
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
