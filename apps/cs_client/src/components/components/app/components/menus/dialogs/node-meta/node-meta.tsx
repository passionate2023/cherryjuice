import * as React from 'react';
import { memo, useEffect, useMemo, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import {
  nodeMetaActionCreators,
  nodeMetaInitialState,
  nodeMetaReducer,
} from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getNode as getNodeSelector } from '::store/selectors/cache/document/node';
import { editNode } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/edit-node';
import { createNode } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { useFormInputs } from '::app/components/menus/dialogs/node-meta/hooks/inputs';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    document,
    documentId: state.document.documentId,
    node_id: document?.persistedState?.selectedNode_id,
    nodes: document?.nodes,
    documentUserId: document?.userId,
    documentPrivacy: document?.privacy,
    showDialog: state.dialogs.showNodeMetaDialog,
    isOnMd: state.root.isOnMd,
    userId: state.auth.user?.id,
  };
};
const mapDispatch = {
  onClose: ac.dialogs.hideNodeMeta,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TNodeMetaModalProps = {};

const NodeMetaModalWithTransition: React.FC<TNodeMetaModalProps &
  PropsFromRedux> = ({
  showDialog,
  isOnMd,
  onClose,
  document,
  nodes,
  node_id,
  userId,
  documentUserId,
  documentPrivacy,
}) => {
  const isOwnerOfDocument = documentUserId === userId;
  const [state, dispatch] = useReducer(nodeMetaReducer, nodeMetaInitialState);
  useEffect(() => {
    nodeMetaActionCreators.init(dispatch);
  }, []);

  const editedNode = useMemo(() => {
    const newNode =
      showDialog === 'create-sibling' || showDialog === 'create-child';
    const documentId = document?.id;
    return newNode
      ? undefined
      : getNodeSelector({ node_id, documentId: documentId });
  }, [node_id, document?.id, showDialog]);
  const fatherNode = nodes ? nodes[node_id] : undefined;

  useEffect(() => {
    if (editedNode) nodeMetaActionCreators.resetToEdit({ node: editedNode });
    else {
      setTimeout(
        () => {
          nodeMetaActionCreators.resetToCreate({
            fatherNode,
          });
        },
        showDialog ? 0 : 500,
      );
    }
  }, [node_id, showDialog, fatherNode]);
  const apply = useDelayedCallback(
    onClose,
    editedNode
      ? () => editNode({ nodeA: editedNode, nodeBMeta: state })
      : () =>
          createNode({
            document,
            nodeBMeta: state,
            createSibling: showDialog === 'create-sibling',
          }),
  );
  const buttonsRight = useMemo(
    () => [
      {
        label: 'dismiss',
        onClick: onClose,
        disabled: false,
      },
      {
        label: editedNode ? 'apply' : 'create',
        onClick: apply,
        disabled: false,
        testId: testIds.nodeMeta__apply,
      },
    ],
    [apply, editedNode, onClose],
  );

  const inputs = useFormInputs({
    documentPrivacy,
    state,
    isOnMd,
    showDialog,
    isOwnerOfDocument,
  });

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      footerLeftButtons={[]}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={onClose}
      onConfirm={apply}
      rightHeaderButtons={[]}
      small={true}
      isShownOnTopOfDialog={true}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const M = memo(connector(NodeMetaModalWithTransition));
export default M;
