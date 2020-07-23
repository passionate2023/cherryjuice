import * as React from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { MetaForm } from '::shared-components/form/meta-form/meta-form';
import { useReducer, useEffect } from 'react';
import { FormInputProps } from '::shared-components/form/meta-form/meta-form-input';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { AlertType } from '::types/react';
import {
  generateNewDocument,
  generateRootNode,
} from '::app/menus/document-meta/helpers/new-document';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ac } from '::root/store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import {
  documentMetaActionCreators,
  documentMetaInitialState,
  documentMetaReducer,
} from './reducer/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showDocumentMetaDialog,
  focusedDocumentId: state.documentsList.focusedDocumentId,
  documents: state.documentsList.documents,
  isOnMobile: state.root.isOnMobile,
  userId: state.auth.user?.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type DocumentMetaDialogProps = {
  showDialog: 'edit' | 'create';
  documentId?: string;
};

type Props = PropsFromRedux & DocumentMetaDialogProps;
const DocumentMetaDialogWithTransition: React.FC<Props> = ({
  showDialog,
  isOnMobile,
  focusedDocumentId,
  documents,
  userId,
}) => {
  const document = documents.find(
    document => document.id === focusedDocumentId,
  );
  const [state, dispatch] = useReducer(
    documentMetaReducer,
    documentMetaInitialState,
  );
  useEffect(() => {
    documentMetaActionCreators.__setDispatch(dispatch);
  }, []);

  useEffect(() => {
    if (showDialog === 'edit')
      documentMetaActionCreators.resetToEdit({
        document,
      });
    else documentMetaActionCreators.resetToCreate({ userId });
  }, [showDialog, focusedDocumentId, userId]);

  const inputs: FormInputProps[] = [
    {
      onChange: documentMetaActionCreators.setName,
      value: state.name,
      type: 'text',
      label: 'Document name',
      lazyAutoFocus: 400,
      testId: testIds.documentMeta__documentName,
    },
    {
      onChange: documentMetaActionCreators.toggleIsPublic,
      value: state.owner.public,
      type: 'checkbox',
      label: 'public',
    },
  ];
  const createDocument = () => {
    try {
      updateCachedHtmlAndImages();
      const document = generateNewDocument(state);
      const rootNode = generateRootNode({ documentId: document.id });
      document.node.push(rootNode);
      apolloCache.changes.initDocumentChangesState(document.id);
      apolloCache.node.create(rootNode);
      apolloCache.document.create(document.id, document);
      ac.document.setDocumentId(document.id);
      if (typeof document?.owner?.public === 'boolean') {
        ac.cache.updateDocumentOwner(document?.owner?.public);
      }
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create a document',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const editDocument = () => {
    const meta = Object.fromEntries(
      Object.entries(state).reduce((entries, [k, v]) => {
        const notEqual =
          typeof v === 'string'
            ? document[k] !== v
            : JSON.stringify(Object.entries(document[k]).sort()) !==
              JSON.stringify(Object.entries(v).sort());
        if (notEqual) entries.push([k, v]);
        return entries;
      }, []),
    );
    apolloCache.changes.initDocumentChangesState(focusedDocumentId);
    apolloCache.document.mutate({ documentId: focusedDocumentId, meta });
    if (typeof meta?.owner?.public === 'boolean') {
      ac.cache.updateDocumentOwner(meta.owner.public);
    }
    ac.documentsList.fetchDocuments();
  };
  const apply = useDelayedCallback(
    ac.dialogs.hideDocumentMetaDialog,
    showDialog === 'edit' ? editDocument : createDocument,
  );
  const buttonsRight: TDialogFooterButton[] = [
    {
      label: 'dismiss',
      onClick: ac.dialogs.hideDocumentMetaDialog,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: apply,
      disabled: false,
      testId: testIds.documentMeta__apply,
    },
  ];
  return (
    <DialogWithTransition
      dialogTitle={'Document Properties'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={Boolean(showDialog)}
      onClose={ac.dialogs.hideDocumentMetaDialog}
      onConfirm={apply}
      rightHeaderButtons={[]}
      small={true}
      isShownOnTopOfDialog={true}
      docked={false}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const _ = connector(DocumentMetaDialogWithTransition);

export default _;
