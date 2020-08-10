import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import { FormInputProps } from '::root/components/shared-components/form/meta-form/meta-form-input';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { AlertType } from '::types/react';
import {
  generateNewDocument,
  generateRootNode,
} from '::root/components/app/components/menus/dialogs/document-meta/helpers/new-document';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac, Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import {
  documentMetaActionCreators,
  documentMetaInitialState,
  documentMetaReducer,
} from './reducer/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { Guests } from '::root/components/app/components/menus/dialogs/document-meta/components/guests/guests';
import { SelectPrivacy } from '::root/components/app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { Privacy } from '::types/graphql/generated';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showDocumentMetaDialog,
  focusedDocumentId: state.documentsList.focusedDocumentId,
  documents: state.documentsList.documents,
  isOnMobile: state.root.isOnMobile,
  userId: state.auth.user?.id,
  documentUserId: state.document.userId,
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
  const focusedDocument = documents.find(
    document => document.id === focusedDocumentId,
  );
  const isOwnerOfFocusedDocument = focusedDocument?.userId === userId;
  const [state, dispatch] = useReducer(
    documentMetaReducer,
    documentMetaInitialState,
  );
  useEffect(() => {
    documentMetaActionCreators.__setDispatch(dispatch);
  }, []);

  useEffect(() => {
    if (showDialog === 'edit') {
      documentMetaActionCreators.resetToEdit({
        document: focusedDocument,
      });
    } else documentMetaActionCreators.resetToCreate({ userId });
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
  ];
  if (isOwnerOfFocusedDocument || showDialog === 'create') {
    inputs.push({
      customInput: (
        <SelectPrivacy
          testId={testIds.documentMeta__documentPrivacy}
          privacy={state.privacy}
          onChange={documentMetaActionCreators.setPrivacy}
        />
      ),
      label: 'visibility',
    });
    if (state.privacy !== Privacy.PRIVATE) {
      inputs.push({
        monolithComponent: <Guests guests={state.guests} userId={userId} />,
        label: 'guests',
      });
    }
  }
  const createDocument = () => {
    try {
      updateCachedHtmlAndImages();
      const document = generateNewDocument({ state, userId });
      const rootNode = generateRootNode({
        documentId: document.id,
      });
      document.node.push(rootNode);
      apolloCache.changes.initDocumentChangesState(document.id);
      apolloCache.node.create(rootNode);
      apolloCache.document.create(document.id, document);
      ac.document.setDocumentId(document.id);
      // if (document.owner.public) {
      //   apolloCache.document.mutate({
      //     documentId: document.id,
      //     meta: { owner: document.owner },
      //   });
      // }
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
            ? focusedDocument[k] !== v
            : Array.isArray(v)
            ? JSON.stringify(v.sort()) !==
              JSON.stringify(focusedDocument[k]?.sort())
            : JSON.stringify(Object.entries(focusedDocument[k]).sort()) !==
              JSON.stringify(Object.entries(v).sort());
        if (notEqual) entries.push([k, v]);
        return entries;
      }, []),
    );
    apolloCache.changes.initDocumentChangesState(focusedDocumentId);
    apolloCache.document.mutate({ documentId: focusedDocumentId, meta });
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
