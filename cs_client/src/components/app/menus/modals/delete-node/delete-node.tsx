import * as React from 'react';
import { EventHandler, useMemo, useCallback } from 'react';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { deleteNode } from '::app/menus/modals/delete-node/helpers/delete-node';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::shared-components/modal/confirmation-modal';
import { AlertType } from '::types/react';
import { testIds } from '::cypress/support/helpers/test-ids';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  nodeId: state.document.selectedNode.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
};

const DeleteNode: React.FC<Props & PropsFromRedux> = ({
  onClose,
  show,
  nodeId,
}) => {
  const node: NodeCached = useMemo(() => apolloCache.node.get(nodeId), [
    nodeId,
  ]);
  const deleteSelectedNode = useCallback(deleteNode(node), [nodeId]);

  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: onClose,
      disabled: false,
      lazyAutoFocus: 300
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
