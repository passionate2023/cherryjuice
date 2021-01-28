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
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { useFormInputs } from '::app/components/menus/dialogs/node-meta/hooks/inputs';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    document,
    documentId: state.document.documentId,
    node_id: document?.persistedState?.selectedNode_id,
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

type TNodeMetaModalProps = Record<string, never>;

const NodeMetaModalWithTransition: React.FC<
  TNodeMetaModalProps & PropsFromRedux
> = ({
  showDialog,
  isOnMd,
  onClose,
  document,
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
    const documentId = document?.id;
    return getNodeSelector({ node_id, documentId: documentId });
  }, [node_id, document?.id]);

  useEffect(() => {
    nodeMetaActionCreators.resetToEdit({ node: editedNode });
  }, [node_id]);

  const apply = useDelayedCallback(onClose, () =>
    editNode({ nodeA: editedNode, nodeBMeta: state }),
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
      disabled: false,
      testId: testIds.nodeMeta__apply,
    },
  ];

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
