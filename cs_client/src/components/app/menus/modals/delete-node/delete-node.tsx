import * as React from 'react';
import { EventHandler, useMemo } from 'react';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';
import { useDeleteNode } from '::app/menus/modals/delete-node/hooks/delete-node';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::shared-components/modal/confirmation-modal';
import { AlertType } from '::types/react';

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
  nodeId: string;
};

const DeleteNode: React.FC<Props> = ({ onClose, show, nodeId }) => {
  const node: NodeCached = useMemo(() => apolloCache.getNode(nodeId), [nodeId]);
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

export default DeleteNode;
