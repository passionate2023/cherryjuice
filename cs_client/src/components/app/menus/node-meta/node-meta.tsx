import * as React from 'react';
import { EventHandler, useContext, useEffect, useReducer } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Form } from './components/form';
import { useSave } from '::app/menus/node-meta/hooks/save';
import { NodeMetaPopup } from '::app/reducer';
import { AppContext } from '::app/context';
import {
  nodeMetaActionCreators,
  nodeMetaInitialState,
  nodeMetaReducer,
} from '::app/menus/node-meta/reducer/reducer';
import { getNode } from '::app/menus/node-meta/helpers/get-node';

type TNodeMetaModalProps = {
  nodeId: string;
  onClose: EventHandler<any>;
};

const NodeMetaModalWithTransition: React.FC<TNodeMetaModalProps & {
  showDialog: NodeMetaPopup;
  isOnMobile: boolean;
}> = ({ showDialog, isOnMobile, nodeId, onClose }) => {
  const { selectedFile: documentId, highest_node_id } = useContext(AppContext);
  const { node, isNewNode } = getNode({
    documentId,
    showDialog,
    nodeId,
    highest_node_id,
  });
  const [state, dispatch] = useReducer(nodeMetaReducer, nodeMetaInitialState);
  useEffect(() => {
    nodeMetaActionCreators.__setDispatch(dispatch);
  }, []);

  useEffect(() => {
    if (showDialog === NodeMetaPopup.EDIT) nodeMetaActionCreators.reset(node);
    else nodeMetaActionCreators.reset(undefined);
  }, [nodeId, showDialog]);

  const { onSave } = useSave({nodeId, node, newNode:isNewNode, state});
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
        <Form state={state} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default NodeMetaModalWithTransition;
