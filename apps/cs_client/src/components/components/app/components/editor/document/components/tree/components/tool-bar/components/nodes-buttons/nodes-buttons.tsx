import * as React from 'react';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, store, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { createNode } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node/create-node';
import { nodeMetaInitialState } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { TreeToolbarButton } from '::app/components/editor/document/components/tree/components/tool-bar/components/nodes-buttons/tree-toolbar-buton/tree-toolbar-button';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  const selectedNodeId = document?.persistedState?.selectedNode_id;
  const node = document?.nodes && document.nodes[selectedNodeId];
  return {
    selectedNode_id: selectedNodeId,
    documentId: state.document.documentId,
    isDocumentOwner: hasWriteAccessToDocument(state),
    read_only: !!node?.read_only,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const createNewNode = (createSibling: boolean) => () => {
  const document = getCurrentDocument(store.getState());
  createNode({
    document,
    createSibling,
    nodeBMeta: {
      ...nodeMetaInitialState,
      name: '',
    },
  });
  ac.editor.showTree();
};

const NodesButtons: React.FC<Props & PropsFromRedux> = ({
  selectedNode_id,
  documentId,
  isDocumentOwner,
  read_only,
}) => {
  const noDocumentIsSelected = !documentId;
  const noNodeIsSelected = !selectedNode_id;
  return (
    <>
      {isDocumentOwner && (
        <>
          <TreeToolbarButton
            icon={'create-sibling'}
            tooltip={'Create a sibling node'}
            disabled={noDocumentIsSelected}
            onClick={createNewNode(true)}
            testId={testIds.toolBar__main__createSiblingNode}
          />
          <TreeToolbarButton
            tooltip={'Create a child node'}
            icon={'create-child'}
            disabled={!selectedNode_id}
            onClick={createNewNode(false)}
            testId={testIds.toolBar__main__createChildNode}
          />

          <TreeToolbarButton
            tooltip={'Edit selected node'}
            onClick={ac.dialogs.showEditNode}
            disabled={noNodeIsSelected || noDocumentIsSelected}
            testId={testIds.toolBar__main__editNodeMeta}
            icon={'edit'}
          />
          <TreeToolbarButton
            tooltip={'Delete selected node'}
            onClick={ac.dialogs.showDeleteNode}
            disabled={noNodeIsSelected || noDocumentIsSelected || read_only}
            testId={testIds.toolBar__main__deleteNode}
            icon={'delete'}
          />
        </>
      )}
    </>
  );
};

const _ = connector(NodesButtons);
export { _ as NodesButtons };
