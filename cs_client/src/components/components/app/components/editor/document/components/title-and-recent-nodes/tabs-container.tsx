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
import { TabContextMenu } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/tab-context-menu';

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
}) => {
  useForceUpdate();
  const [showHiddenTabs, setShowHiddenTabs] = useState(false);
  const [CMOffset, setCMOffset] = useState(0);
  const [focusedNode_id, setFocusedNode_id] = useState(0);
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

  const onRightClickM = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const focusedNode_id = target.dataset.id || target.parentElement.dataset.id;
    if (focusedNode_id) {
      setFocusedNode_id(+focusedNode_id);
      setCMOffset(e.clientX - tabsR.current?.getBoundingClientRect().x);
    }
  }, []);
  return (
    <div className={modTabs.tabsContainer} onContextMenu={onRightClickM}>
      <ContextMenuWrapper
        show={CMOffset > 0}
        hide={() => setCMOffset(0)}
        contextMenu={
          <TabContextMenu
            focusedNode_id={focusedNode_id}
            hide={() => setCMOffset(0)}
          />
        }
        offset={[CMOffset, 0]}
      >
        <Tabs
          documentId={documentId}
          nodes={visible.map(node_id => ({
            node_id,
            name: nodes[node_id].name,
            hasChanges: !!localState.editedNodes.edited[node_id],
          }))}
          selectedNode_id={selectedNode_id}
          ref={tabsR}
          isOnMd={isOnMd}
        />
      </ContextMenuWrapper>

      {!!hidden.length && (
        <HiddenTabs
          documentId={documentId}
          nodes={hidden.map(node_id => ({
            node_id,
            name: nodes[node_id].name,
          }))}
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
