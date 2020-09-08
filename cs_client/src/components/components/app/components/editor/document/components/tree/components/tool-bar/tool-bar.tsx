import * as React from 'react';
import { modTreeToolBar } from '::sass-modules';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icons } from '::root/components/shared-components/icon/icon';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useCallback } from 'react';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);

  const selectedNodeId = document?.state?.selectedNode_id;
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
      <ButtonCircle iconName={Icons.material.focus} onClick={expandNode} />
    </div>
  );
};

const _ = connector(ToolBar);
export { _ as ToolBar };
