import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { appActionCreators } from '::app/reducer';
import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { SnackbarMessages } from '::shared-components/snackbar/snackbar-messages';
import { useIsNotProcessed } from '::hooks/misc/isnot-processed';
import { AlertType } from '::types/react';
import { saveNodesMeta } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';
import { saveNewNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';
import {
  saveDeletedNodes,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { saveNodesContent } from '::app/editor/document/hooks/save-document/helpers/save-nodes-content';

type SaveDocumentProps = {
  saveDocumentCommandID: string;
  nodes: TEditedNodes;
  documentHasUnsavedChanges;
};
const useSaveDocument = async ({
  saveDocumentCommandID,
  nodes,
  documentHasUnsavedChanges,
}: SaveDocumentProps) => {
  const [mutateContent] = useMutation(DOCUMENT_MUTATION.ahtml);
  const [mutateMeta] = useMutation(DOCUMENT_MUTATION.meta);
  const [mutateCreate] = useMutation(DOCUMENT_MUTATION.createNode.query);
  const [deleteNodeMutation] = useMutation(DOCUMENT_MUTATION.deleteNode.query);

  const isNotProcessed = useIsNotProcessed([saveDocumentCommandID]);
  if (isNotProcessed && documentHasUnsavedChanges) {
    try {
      const state: SaveOperationState = {
        newFatherIds: {},
      };
      await saveDeletedNodes({ mutate: deleteNodeMutation, nodes, state });
      await saveNewNodes({ mutate: mutateCreate, nodes, state });
      await saveNodesMeta({ mutate: mutateMeta, nodes, state });
      await saveNodesContent({ mutate: mutateContent, nodes, state });
      appActionCreators.reloadDocument();
      appActionCreators.setSnackbarMessage(SnackbarMessages.documentSaved);
    } catch (e) {
      appActionCreators.setAlert({
        title: 'Could not save',
        description: 'Check your network connection',
        type: AlertType.Error,
        error: e,
      });
    }
  }
};

export { useSaveDocument };
