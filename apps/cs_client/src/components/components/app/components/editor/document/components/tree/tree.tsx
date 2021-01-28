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
  InlineInputProps,
  useInlineInputProvider,
} from '::shared-components/inline-input/hooks/inline-input-provider';
export const TreeContext = createInlineInputProviderContext();
const getParamsFromLocation = () => {
  const params = { expand: undefined };
  const expand = /expand=(\d+)/.exec(location.search);
  if (expand) {
    params.expand = expand[1];
  }
  return params;
};
export const globalTreeInlineInputProps: { current: InlineInputProps } = {
  current: undefined,
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
  useEffect(() => {
    globalTreeInlineInputProps.current = inlineInputProps;
  }, [inlineInputProps]);
  const contextMenuItems = useTreeContextMenuItems({
    copiedNode,
    rename: inlineInputProps.setCurrentlyEnabledInput,
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
          {({ ref, show }) => (
            <div
              className={modTree.tree}
              onContextMenu={show}
              ref={ref}
              id="tree"
            >
              <ToolBar />
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
            </div>
          )}
        </ContextMenuWrapper>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };
