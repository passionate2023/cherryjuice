import { modAlertModal, modDeleteDocument } from '::sass-modules/index';
import * as React from 'react';
import { EventHandler, useMemo } from 'react';
import { ModalWithTransition } from '::shared-components/modal/modal';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { NodeCached } from '::types/graphql/adapters';
import { apolloCache } from '::graphql/cache-helpers';
import { useDeleteNode } from '::app/menus/modals/delete-document/hooks/delete-node';

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
  nodeId: string;
};

const ModalBody = ({ title, description }: { title; description }) => {
  return (
    <>
      <span className={modAlertModal.alertModal__body}>
        <span
          className={`${modAlertModal.alertModal__header} ${modAlertModal.alertModal__headerDanger}`}
        >
          {title}
        </span>
        <span className={`${modAlertModal.alertModal__message}`}>
          {description}
        </span>
      </span>
    </>
  );
};

const DeleteDocument: React.FC<Props> = ({ onClose, show, nodeId }) => {
  const node: NodeCached = useMemo(() => apolloCache.getNode(nodeId), [nodeId]);
  const deleteDocument = useDeleteNode(nodeId, node);

  return (
    <ModalWithTransition show={show} onClose={onClose}>
      <ModalBody
        description={
          node?.child_nodes.length
            ? 'this would delete all of  its child nodes'
            : 'this node has no child nodes'
        }
        title={'Permanently delete "' + node?.name + '" ?'}
      />
      <div className={modDeleteDocument.deleteDocument__buttons}>
        <ButtonSquare
          className={`${modAlertModal.alertModal__dismissButton}`}
          onClick={onClose}
          lazyAutoFocus={300}
        >
          Dismiss
        </ButtonSquare>
        <ButtonSquare
          className={`${modAlertModal.alertModal__dismissButton}`}
          onClick={deleteDocument}
        >
          delete
        </ButtonSquare>
      </div>
    </ModalWithTransition>
  );
};

export default DeleteDocument;
