import * as React from 'react';
import { ToolbarButton } from '@cherryjuice/components';
import { Icon } from '@cherryjuice/icons';
import { modToolbar } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, store, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Tooltip } from '@cherryjuice/components';
import { memo } from 'react';
import { createNode } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node';
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
  children,
}) => {
  const noDocumentIsSelected = !documentId;
  const noNodeIsSelected = !selectedNode_id;
  return (
    <div
      className={joinClassNames([
        modToolbar.toolBar__group,
        modToolbar.toolBar__groupMainBar,
      ])}
    >
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={createNewNode(true)}
        testId={testIds.toolBar__main__createSiblingNode}
        disabled={noDocumentIsSelected}
      >
        <Tooltip label={'Create a sibling node'}>
          <Icon name={'create-sibling'} size={20} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={createNewNode(false)}
        testId={testIds.toolBar__main__createChildNode}
        disabled={!selectedNode_id}
      >
        <Tooltip label={'Create a child node'}>
          <Icon name={'create-child'} size={20} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showEditNode}
        disabled={noNodeIsSelected || noDocumentIsSelected}
        testId={testIds.toolBar__main__editNodeMeta}
      >
        <Tooltip label={'Edit selected node'}>
          <Icon name={'edit'} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showDeleteNode}
        disabled={noNodeIsSelected || noDocumentIsSelected || read_only}
        testId={testIds.toolBar__main__deleteNode}
      >
        <Tooltip label={'Delete selected node'}>
          <Icon name={'delete'} />
        </Tooltip>
      </ToolbarButton>
      {children}
    </div>
  );
};
const _ = connector(NodesButtons);
const M = memo(_);
export { M as NodesButtons };
