import * as React from 'react';
import { EventHandler, useMemo, useCallback } from 'react';
import { deleteNode } from '::root/components/app/components/menus/modals/delete-node/helpers/delete-node';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::root/components/shared-components/modal/confirmation-modal';
import { AlertType } from '::types/react';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getNode } from '::store/selectors/cache/document/node';

const mapState = (state: Store) => ({
  node_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
  documentId: state.document.documentId,
  show: state.dialogs.showDeleteNode,
});
const mapDispatch = {
  onClose: ac.dialogs.hideDeleteNode,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
};

const DeleteNode: React.FC<Props & PropsFromRedux> = ({
  onClose,
  show,
  node_id,
  documentId,
}) => {
  const node = useMemo(() => {
    return getNode({ node_id, documentId });
  }, [node_id]);
  const deleteSelectedNode = useDelayedCallback(
    ac.dialogs.hideDeleteNode,
    useCallback(deleteNode(node), [node_id]),
  );

  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: onClose,
      disabled: false,
      lazyAutoFocus: 300,
    },
    {
      label: 'Delete',
      onClick: deleteSelectedNode,
      disabled: false,
      testId: testIds.modal__deleteNode__confirm,
    },
  ];
  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      alert={{
        type: AlertType.Warning,
        description: node?.child_nodes.length
          ? 'this would delete all of  its child nodes'
          : 'this node has no child nodes',
        title: 'Permanently delete "' + node?.name + '" ?',
      }}
      buttons={buttons}
    />
  );
};
const _ = connector(DeleteNode);
export default _;
