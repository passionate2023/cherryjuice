import * as React from 'react';
import { useEffect } from 'react';
import { Node } from './components/node/node';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Resizable } from 're-resizable';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ToolBar } from './components/tool-bar/tool-bar';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { modNode, modTree } from '::sass-modules';
import { ContextMenu } from '@cherryjuice/components';
import { useTreeContextMenuItems } from '::root/components/app/components/editor/document/components/tree/hooks/tree-context-menu-items';
import nodeMod from '::sass-modules/tree/node.scss';
import {
  createInlineInputProviderContext,
  useInlineInputProvider,
} from '::shared-components/inline-input/hooks/inline-input-provider';
import { getEditor } from '@cherryjuice/editor';
import { nodeOverlay } from '::app/components/editor/document/components/tree/components/node/helpers/node-overlay';
import {
  joinClassNames,
  useCurrentBreakpoint,
} from '@cherryjuice/shared-helpers';
import { treeResizeHandler } from '::app/components/editor/document/document';
import { treePosition } from '::store/selectors/editor/tree-position';
export const TreeContext = createInlineInputProviderContext();
const getParamsFromLocation = () => {
  const params = { expand: undefined };
  const expand = /expand=(\d+)/.exec(location.search);
  if (expand) {
    params.expand = expand[1];
  }
  return params;
};

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    documentPrivacy: document?.privacy,
    treeState: document?.persistedState?.treeState,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    filteredNodes: state.document.filteredNodes,
    documentId: state.document.documentId,
    copiedNode: state.documentCache.copiedNode,
    isOwnerOfCurrentDocument: state.auth.user?.id === document.userId,
    showTree: state.editor.showTree,
    treePosition: treePosition(state),
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Tree: React.FC<PropsFromRedux> = ({
  nodes,
  documentPrivacy,
  treeState,
  filteredNodes,
  documentId,
  copiedNode,
  isOwnerOfCurrentDocument,
  selectedNode_id,
  treePosition,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  useEffect(() => {
    treeResizeHandler.init(
      document.querySelector('.' + modTree.tree__resizeHandle),
    );
  }, []);
  useEffect(() => {
    treeResizeHandler.onTreePositionChange(treePosition);
  }, [treePosition]);
  useEffect(() => {
    if (selectedNode_id) {
      const node = document
        .querySelector('.' + modTree.tree)
        .querySelector(`[data-node-id="${selectedNode_id}"]`);
      if (node) {
        nodeOverlay.setNode(node);
        nodeOverlay.updateWidth();
        nodeOverlay.updateLeft();
      }
    }
  }, [selectedNode_id]);

  const params = getParamsFromLocation();
  const getContext = {
    getIdOfActiveElement: target => {
      const nodeElement: HTMLElement = target.closest('.' + modNode.node);
      if (nodeElement) return nodeElement.dataset.cmiId;
    },
  };

  const inlineInputProps = useInlineInputProvider({
    disable: !isOwnerOfCurrentDocument,
    onApply: (id, value) => {
      const [documentId, node_id] = id.split('/');
      if (documentId && node_id && value)
        ac.documentCache.mutateNodeMeta({
          documentId,
          node_id: +node_id,
          data: { name: value },
        });
      getEditor()?.focus();
    },

    onDiscard: (id, currentValue, originalInputValue) => {
      const [documentId, node_id] = id.split('/');
      if (node_id && !currentValue?.trim() && !originalInputValue?.trim()) {
        ac.documentCache.mutateNodeMeta({
          documentId,
          node_id: +node_id,
          data: { name: '?' },
        });
      }
    },
  });

  const contextMenuItems = useTreeContextMenuItems({
    copiedNode,
    rename: id => inlineInputProps.enableInput(id)(),
    isOwnerOfCurrentDocument,
  });
  const treeLeft = treePosition === 'left';
  const treeBottom = treePosition === 'bottom';
  return (
    <Resizable
      enable={{
        right: treeLeft,
        top: treeBottom,
      }}
      onResize={treeResizeHandler.onResize}
      onResizeStop={treeResizeHandler.onResizeStop}
      className={joinClassNames([
        modTree.tree__resizeHandle,
        treeLeft && modTree.tree__resizeHandleTreeLeft,
        treeBottom && modTree.tree__resizeHandleTreeBottom,
      ])}
    >
      <ErrorBoundary>
        <ContextMenu getContext={getContext} items={contextMenuItems}>
          {({ show }) => (
            <div
              className={joinClassNames([
                modTree.tree,
                treeLeft && modTree.treeLeft,
                treeBottom && modTree.treeBottom,
              ])}
              onContextMenu={show}
              id="tree"
            >
              {!mbOrTb && <ToolBar />}
              <TreeContext.Provider value={inlineInputProps}>
                <Droppable
                  anchorId={'0'}
                  anchorClassName={modNode.node}
                  meta={{ documentId }}
                  onDrop={ac.node.drop}
                  onDragEnterStyleClass={nodeMod.droppableDraggingOver}
                >
                  {(provided, ref) => (
                    <ul
                      className={modTree.tree_rootList}
                      {...provided}
                      ref={ref}
                      onContextMenu={show}
                    >
                      {nodes &&
                        nodes[0] &&
                        nodes[0].child_nodes.map((node_id, index) => {
                          const node = nodes[node_id];
                          if (!filteredNodes || filteredNodes[node_id])
                            return (
                              <Node
                                index={index}
                                fatherState={treeState[0]}
                                key={node.node_id}
                                node_id={node.node_id}
                                nodes={nodes}
                                depth={0}
                                node_title_styles={node.node_title_styles}
                                documentPrivacy={documentPrivacy}
                                parentPrivacy={NodePrivacy.DEFAULT}
                                expand={params.expand}
                                filteredNodes={filteredNodes}
                              />
                            );
                        })}
                    </ul>
                  )}
                </Droppable>
              </TreeContext.Provider>
              {mbOrTb && <ToolBar />}
            </div>
          )}
        </ContextMenu>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };
