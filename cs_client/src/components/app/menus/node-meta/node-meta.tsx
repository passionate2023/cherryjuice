import * as React from 'react';
import { EventHandler, useContext } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { RootContext } from '::root/root-context';
import { Form } from './components/form';
import { useSave } from '::app/menus/node-meta/hooks/save';
import { NodeMetaPopup } from '::app/reducer';
import { createNode } from '::app/menus/node-meta/helpers/create-node';
import { AppContext } from '::app/context';

type TNodeMetaModalProps = {
  nodeId: string;
  onClose: EventHandler<any>;
};

const NodeMetaModalWithTransition: React.FC<TNodeMetaModalProps & {
  showDialog: NodeMetaPopup;
  isOnMobile: boolean;
}> = ({ showDialog, isOnMobile, nodeId, onClose }) => {
  const {
    apolloClient: { cache },
  } = useContext(RootContext);
  const {
    selectedFile: documentId,
    highest_node_id,
    selectedNode,
  } = useContext(AppContext);
  let node;
  const newNode =
    showDialog === NodeMetaPopup.CREATE_SIBLING ||
    showDialog === NodeMetaPopup.CREATE_CHILD;
  if (newNode) {
    // @ts-ignore
    const _selectedNode = cache.data.get('Node:' + selectedNode.nodeId);

    node = createNode({
      documentId,
      highest_node_id,
      father_id:
        showDialog === NodeMetaPopup.CREATE_SIBLING
          ? _selectedNode.father_id
          : _selectedNode.node_id,
      previous_sibling_node_id:
        showDialog === NodeMetaPopup.CREATE_SIBLING
          ? _selectedNode.node_id
          : -1,
    });
  } else {
    // @ts-ignore
    node = cache.data.get('Node:' + nodeId);
  }
  const { onSave, refs } = useSave(
    cache,
    newNode ? node.id : nodeId,
    node,
    newNode,
  );
  const buttonsRight = [
    {
      label: 'dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: onSave,
      disabled: false,
    },
  ];

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={Boolean(showDialog)}
      onClose={onClose}
      rightHeaderButtons={[]}
      small={true}
    >
      <ErrorBoundary>
        <Form node={node} refs={refs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default NodeMetaModalWithTransition;
