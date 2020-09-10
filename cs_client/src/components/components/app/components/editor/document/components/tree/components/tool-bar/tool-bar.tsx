import * as React from 'react';
import { modTreeToolBar } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useCallback } from 'react';
import { FilterNodes } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/components/filter-nodes';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);

  const selectedNodeId = document?.persistedState?.selectedNode_id;
  const father_id = document?.nodes && document.nodes[selectedNodeId].father_id;
  return {
    node_id: father_id,
    documentId: document?.id,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ToolBar: React.FC<Props & PropsFromRedux> = ({ node_id, documentId }) => {
  const expandNode = useCallback(
    () =>
      ac.documentCache.expandNode({
        documentId,
        node_id: node_id,
      }),
    [documentId, node_id],
  );
  return (
    <div className={modTreeToolBar.treeToolBar}>
      <div className={modTreeToolBar.treeToolBar__controls}>
        <FilterNodes />
        <ButtonSquare
          iconName={Icons.material.focus}
          onClick={expandNode}
          className={modTreeToolBar.tree_focusButton}
        />
      </div>
    </div>
  );
};

const _ = connector(ToolBar);
export { _ as ToolBar };
