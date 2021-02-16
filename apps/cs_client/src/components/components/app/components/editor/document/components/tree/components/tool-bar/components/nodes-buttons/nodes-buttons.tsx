import * as React from 'react';
import { ButtonSquare } from '@cherryjuice/components';
import { modTreeToolBar } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, store, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { createNode } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node/create-node';
import { nodeMetaInitialState } from '::app/components/menus/dialogs/node-meta/reducer/reducer';

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
          <ButtonSquare
            onClick={createNewNode(true)}
            testId={testIds.toolBar__main__createSiblingNode}
            disabled={noDocumentIsSelected}
            className={modTreeToolBar.button}
            iconName={'create-sibling'}
            iconSize={20}
            tooltip={'Create a sibling node'}
          />
          <ButtonSquare
            onClick={createNewNode(false)}
            className={modTreeToolBar.button}
            testId={testIds.toolBar__main__createChildNode}
            disabled={!selectedNode_id}
            iconName={'create-child'}
            tooltip={'Create a child node'}
            iconSize={20}
          />

          <ButtonSquare
            className={modTreeToolBar.button}
            iconSize={20}
            onClick={ac.dialogs.showEditNode}
            disabled={noNodeIsSelected || noDocumentIsSelected}
            testId={testIds.toolBar__main__editNodeMeta}
            iconName={'edit'}
            tooltip={'Edit selected node'}
          />
          <ButtonSquare
            className={modTreeToolBar.button}
            iconSize={20}
            onClick={ac.dialogs.showDeleteNode}
            disabled={noNodeIsSelected || noDocumentIsSelected || read_only}
            testId={testIds.toolBar__main__deleteNode}
            iconName={'delete'}
            tooltip={'Delete selected node'}
          />
        </>
      )}
    </>
  );
};

const _ = connector(NodesButtons);
export { _ as NodesButtons };
