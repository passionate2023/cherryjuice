import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { appActionCreators } from '::app/reducer';
import { SnackbarMessages } from '::shared-components/snackbar/snackbar-messages';
import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { AlertType } from '::types/react';
import { saveNodesMeta } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';
import { saveNewNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';
import {
  deleteDanglingNodes,
  saveDeletedNodes,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { saveNodesContent } from '::app/editor/document/hooks/save-document/helpers/save-nodes-content';
import { useEffect } from 'react';
import { saveNewDocument } from '::app/editor/document/hooks/save-document/helpers/save-new-document';
import { useHistory } from 'react-router';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { swapTreeStateDocumentId } from '::app/editor/document/tree/node/hooks/persisted-tree-state/helpers';

type SaveDocumentProps = {
  saveDocumentCommandID: string;
  documentHasUnsavedChanges;
};

const fn = createIsNotProcessed();
const useSaveDocument = ({
  saveDocumentCommandID,
  documentHasUnsavedChanges,
}: SaveDocumentProps) => {
  const history = useHistory();
  const [mutateContent] = useMutation(DOCUMENT_MUTATION.ahtml);
  const [mutateMeta] = useMutation(DOCUMENT_MUTATION.meta);
  const [mutateCreate] = useMutation(DOCUMENT_MUTATION.createNode.query);
  const [deleteNodeMutation] = useMutation(DOCUMENT_MUTATION.deleteNode.query);
  const [createDocumentMutation] = useMutation(
    DOCUMENT_MUTATION.createDocument.query,
  );

  useEffect(() => {
    const isNotProcessed = fn([saveDocumentCommandID]);
    if (isNotProcessed && documentHasUnsavedChanges) {
      (async () => {
        try {
          const state: SaveOperationState = {
            newFatherIds: {},
            swappedDocumentIds: {},
            swappedNodeIds: {},
            danglingNodes: {},
            deletedNodes: {},
          };
          updateCachedHtmlAndImages();
          await saveNewDocument({ mutate: createDocumentMutation, state });
          await saveDeletedNodes({ mutate: deleteNodeMutation, state });
          await saveNewNodes({ mutate: mutateCreate, state });
          await saveNodesContent({ mutate: mutateContent, state });
          await saveNodesMeta({ mutate: mutateMeta, state });
          await deleteDanglingNodes({ mutate: deleteNodeMutation, state });

          const createdDocuments = Object.values(state.swappedDocumentIds);
          if (createdDocuments.length) {
            swapTreeStateDocumentId(state.swappedDocumentIds);
            if (history.location.pathname.startsWith('/document/new-document'))
              appActionCreators.selectFile(createdDocuments.pop());
          } else appActionCreators.reloadDocument();
          appActionCreators.setSnackbarMessage(SnackbarMessages.documentSaved);
        } catch (e) {
          appActionCreators.setAlert({
            title: 'Could not save',
            description: 'Check your network connection',
            type: AlertType.Error,
            error: e,
          });
        }
      })();
    }
  }, [saveDocumentCommandID]);
};

export { useSaveDocument };
