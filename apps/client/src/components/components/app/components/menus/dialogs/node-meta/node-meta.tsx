import * as React from 'react';
import { memo, useEffect, useReducer, useRef, useState } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import {
  nodeMetaActionCreators,
  nodeMetaInitialState,
  nodeMetaReducer,
} from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { testIds } from '@cherryjuice/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getNode as getNodeSelector } from '::store/selectors/cache/document/node';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { useFormInputs } from '::app/components/menus/dialogs/node-meta/hooks/inputs';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { QFullNode } from '::store/ducks/document-cache/document-cache';
import { calculateEditedAttribute } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/calculate-edited-attributes/calculate-edited-attributes';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    document,
    documentId: state.document.documentId,
    node_id: document?.persistedState?.selectedNode_id,
    documentUserId: document?.userId,
    documentPrivacy: document?.privacy,
    showDialog: state.dialogs.showNodeMetaDialog,
    userId: state.auth.user?.id,
  };
};
const mapDispatch = {
  onClose: ac.dialogs.hideNodeMeta,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const NodeMetaModalWithTransition: React.FC<PropsFromRedux> = ({
  showDialog,
  onClose,
  document,
  node_id,
  userId,
  documentUserId,
  documentPrivacy,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const isOwnerOfDocument = documentUserId === userId;
  const nodeDepthRef = useRef(0);
  const editedNodeRef = useRef<QFullNode>();
  const [state, dispatch] = useReducer(nodeMetaReducer, nodeMetaInitialState);
  useEffect(() => {
    nodeMetaActionCreators.init(dispatch);
  }, []);

  useEffect(() => {
    const documentId = document?.id;
    nodeDepthRef.current = document?.nodes
      ? getParentsNode_ids({
          node_id,
          nodes: document.nodes,
        }).length
      : 0;
    editedNodeRef.current = getNodeSelector({
      node_id,
      documentId: documentId,
    });
    if (editedNodeRef.current)
      nodeMetaActionCreators.resetToEdit({
        node: editedNodeRef.current,
        nodeDepth: nodeDepthRef.current,
      });
  }, [showDialog]);

  const [changes, setChanges] = useState({});
  useEffect(() => {
    setChanges(
      calculateEditedAttribute({
        nodeA: editedNodeRef.current,
        nodeBMeta: state,
      }),
    );
  }, [state]);
  const apply = useDelayedCallback(onClose, () =>
    ac.documentCache.mutateNodeMeta({
      node_id: editedNodeRef.current.node_id,
      documentId: document?.id,
      data: changes,
    }),
  );
  const buttonsRight = [
    {
      label: 'dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: apply,
      disabled: Object.keys(changes).length === 0,
      testId: testIds.nodeMeta__apply,
    },
  ];

  const inputs = useFormInputs({
    documentPrivacy,
    state,
    mbOrTb,
    showDialog,
    isOwnerOfDocument,
  });

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      footerLeftButtons={[]}
      footRightButtons={buttonsRight}
      isOnMobile={mbOrTb}
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
