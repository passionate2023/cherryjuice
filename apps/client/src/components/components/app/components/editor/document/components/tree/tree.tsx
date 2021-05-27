import * as React from 'react';
import { useEffect } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Resizable } from 're-resizable';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ToolBar } from './components/tool-bar/tool-bar';
import { modNode, modTree } from '::sass-modules';
import { ContextMenu } from '@cherryjuice/components';
import { useTreeContextMenuItems } from '::root/components/app/components/editor/document/components/tree/hooks/tree-context-menu-items';
import {
  createInlineInputProviderContext,
  useInlineInputProvider,
} from '::shared-components/inline-input/hooks/inline-input-provider';
import { getEditor } from '@cherryjuice/editor';
import {
  joinClassNames,
  useCurrentBreakpoint,
  useLoader,
} from '@cherryjuice/shared-helpers';
import { treeResizeHandler } from '::app/components/editor/document/document';
import { treePosition } from '::store/selectors/editor/tree-position';
import { RootList } from '::app/components/editor/document/components/tree/root-list/root-list';
import { RootListSkeleton } from '::app/components/editor/document/components/tree/components/root-list-skeleton/root-list-skeleton';
export const TreeContext = createInlineInputProviderContext();

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    copiedNode: state.documentCache.copiedNode,
    isOwnerOfCurrentDocument:
      state.auth.user?.id && state.auth.user?.id === document?.userId,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    treePosition: treePosition(state),
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Tree: React.FC<PropsFromRedux> = ({
  nodes,
  copiedNode,
  isOwnerOfCurrentDocument,
  treePosition,
}) => {
  const ready = nodes && nodes[0];
  const { mbOrTb } = useCurrentBreakpoint();
  useEffect(() => {
    treeResizeHandler.init(
      document.querySelector('.' + modTree.tree__resizeHandle),
    );
  }, []);
  useEffect(() => {
    treeResizeHandler.onTreePositionChange(treePosition);
  }, [treePosition]);

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
  const showLoader = useLoader({
    waitBeforeShowing: 1000,
    minimumLoadingDuration: 1000,
    loading: !ready,
  });
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
                {showLoader ? <RootListSkeleton /> : <RootList />}
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
