import * as React from 'react';
import { modTreeToolBar } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useCallback, useState } from 'react';
import { FilterNodes } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/components/filter-nodes';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);

  const selectedNodeId = document?.persistedState?.selectedNode_id;
  const node = document?.nodes && document.nodes[selectedNodeId];
  const father_id = node && node.father_id;
  return {
    node_id: father_id,
    documentId: document?.id,
    showNodePath: state.editor.showNodePath,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  node_id,
  documentId,
  showNodePath,
}) => {
  const expandNode = useCallback(
    () =>
      ac.documentCache.expandNode({
        documentId,
        node_id: node_id,
      }),
    [documentId, node_id],
  );
  const collapseAllNodes = useCallback(
    () =>
      ac.documentCache.collapseNode({
        documentId,
        node_id: 0,
      }),
    [documentId],
  );
  const expandAllNodes = useCallback(
    async () =>
      ac.documentCache.expandNode({
        documentId,
        node_id: 0,
        mode: 'expand-all',
      }),
    [documentId],
  );
  const [CMShown, setCMShown] = useState(false);
  const hide = () => setCMShown(false);
  const show = () => setCMShown(true);
  return (
    <div className={modTreeToolBar.treeToolBar}>
      <div className={modTreeToolBar.treeToolBar__controls}>
        <FilterNodes />
        <ContextMenuWrapper
          shown={CMShown}
          hide={hide}
          show={show}
          items={[
            {
              name: 'focus selected node',
              onClick: expandNode,
              hideOnClick: true,
            },
            {
              name: 'expand all nodes',
              onClick: expandAllNodes,
              hideOnClick: true,
            },
            {
              name: 'collapse all nodes',
              onClick: collapseAllNodes,
              hideOnClick: true,
              bottomSeparator: true,
            },
            {
              name: 'show node path',
              onClick: ac.editor.toggleNodePath,
              active: showNodePath,
              hideOnClick: false,
            },
          ]}
        >
          <ButtonSquare
            iconName={Icons.material['three-dots-vertical']}
            className={modTreeToolBar.tree_focusButton}
          />
        </ContextMenuWrapper>
      </div>
    </div>
  );
};

const _ = connector(ToolBar);
export { _ as ToolBar };
