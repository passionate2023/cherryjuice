import * as React from 'react';
import { modTabs } from '::sass-modules';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Tabs } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/tabs';
import { useEffect, useRef, useState } from 'react';
import {
  clampTabs,
  getNumberOfVisibleTabs,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/helpers/clamp-tabs/clamp-tabs';
import { HiddenTabs } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/hidden-tabs';

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
    treeWidth: state.editor.treeWidth,
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
}) => {
  useForceUpdate();
  const [showHiddenTabs, setShowHiddenTabs] = useState(false);
  const tabsR = useRef<HTMLDivElement>();
  const node = nodes[selectedNode_id];

  const previous = useRef<[number[], number[]]>([[], []]);
  let visible: number[], hidden: number[];
  if (isOnMd) {
    visible = recentNodes;
    hidden = [];
  } else {
    const numberOfVisibleTabs = Math.ceil(
      getNumberOfVisibleTabs(tabsR.current?.clientWidth),
    );
    const selectedNodeAlreadyVisible = previous.current[0].includes(
      selectedNode_id,
    );
    const thereIsNoAdditionalRoom =
      previous.current[0].length >= numberOfVisibleTabs;

    if (selectedNodeAlreadyVisible && thereIsNoAdditionalRoom) {
      const removedNodes =
        previous.current[0].length + previous.current[1].length >
        recentNodes.length;
      if (removedNodes) {
        const set = new Set(recentNodes);
        previous.current[0] = previous.current[0].filter(node_id =>
          set.has(node_id),
        );
        previous.current[1] = previous.current[1].filter(node_id =>
          set.has(node_id),
        );
      }

      [visible, hidden] = previous.current;
    } else {
      [visible, hidden] = clampTabs(
        recentNodes,
        selectedNode_id,
        numberOfVisibleTabs,
      );
      previous.current = [visible, hidden];
    }
  }

  return node ? (
    <div className={modTabs.tabsContainer}>
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
  ) : (
    <></>
  );
};

const _ = connector(TabsContainer);
export { _ as TabsContainer };
