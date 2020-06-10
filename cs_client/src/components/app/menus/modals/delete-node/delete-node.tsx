import * as React from 'react';
import { EventHandler, useMemo } from 'react';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { useDeleteNode } from '::app/menus/modals/delete-node/hooks/delete-node';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::shared-components/modal/confirmation-modal';
import { AlertType } from '::types/react';
import { testIds } from '::cypress/support/helpers/test-ids';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store';

const mapState = (state: Store) => ({
  nodeId: state.node.selectedNode.id,
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
  const deleteNode = useDeleteNode(nodeId, node);

  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'Delete',
      onClick: deleteNode,
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
