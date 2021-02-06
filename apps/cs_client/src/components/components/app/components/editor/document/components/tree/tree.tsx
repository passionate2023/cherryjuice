import * as React from 'react';
import { useEffect } from 'react';
import { Node } from './components/node/node';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ToolBar } from './components/tool-bar/tool-bar';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { modNode, modTree } from '::sass-modules';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';
import { useTreeContextMenuItems } from '::root/components/app/components/editor/document/components/tree/hooks/tree-context-menu-items';
import nodeMod from '::sass-modules/tree/node.scss';
import {
  createInlineInputProviderContext,
  useInlineInputProvider,
} from '::shared-components/inline-input/hooks/inline-input-provider';
import { getEditor } from '@cherryjuice/editor';
export const TreeContext = createInlineInputProviderContext();
const getParamsFromLocation = () => {
  const params = { expand: undefined };
  const expand = /expand=(\d+)/.exec(location.search);
  if (expand) {
    params.expand = expand[1];
  }
  return params;
};

type Props = Record<string, never>;

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    documentPrivacy: document?.privacy,
    treeState: document?.persistedState?.treeState,
    filteredNodes: state.document.filteredNodes,
    documentId: state.document.documentId,
    copiedNode: state.documentCache.copiedNode,
    isOwnerOfCurrentDocument: state.auth.user?.id === document.userId,
    tb: state.root.isOnTb,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Tree: React.FC<Props & PropsFromRedux> = ({
  nodes,
  documentPrivacy,
  treeState,
  filteredNodes,
  documentId,
  copiedNode,
  isOwnerOfCurrentDocument,
  tb,
}) => {
  useEffect(onStart, []);

  const params = getParamsFromLocation();
  const hookProps = {
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
  return (
    <Resizable
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={modTree.tree__resizeHandle}
    >
      <ErrorBoundary>
        <ContextMenuWrapper hookProps={hookProps} items={contextMenuItems}>
          {({ show }) => (
            <div className={modTree.tree} onContextMenu={show} id="tree">
              {!tb && <ToolBar />}
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
              {tb && <ToolBar />}
            </div>
          )}
        </ContextMenuWrapper>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };
