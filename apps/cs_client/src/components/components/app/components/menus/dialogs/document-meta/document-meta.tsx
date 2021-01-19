import * as React from 'react';
import { memo, useEffect, useMemo, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { ac, Store } from '::store/store';
import {
  documentMetaActionCreators,
  documentMetaInitialState,
  documentMetaReducer,
} from './reducer/reducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  getDocumentsList,
  getDocumentUserId,
} from '::store/selectors/cache/document/document';
import { useFooterButtons } from '::app/components/menus/dialogs/document-meta/hooks/footer-buttons';
import { useCreateDocument } from '::app/components/menus/dialogs/document-meta/hooks/create-document';
import { useEditDocument } from '::app/components/menus/dialogs/document-meta/hooks/edit-document';
import { useFormInputs } from '::app/components/menus/dialogs/document-meta/hooks/inputs';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showDocumentMetaDialog,
  focusedDocumentId: state.home.activeDocumentId || state.document.documentId,
  documents: getDocumentsList(state),
  isOnMd: state.root.isOnMd,
  userId: state.auth.user?.id,
  documentUserId: getDocumentUserId(state),
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
  isOnMd,
  focusedDocumentId,
  documents,
  userId,
}) => {
  const focusedDocument = useMemo(
    () => documents.find(document => document.id === focusedDocumentId),
    [documents, focusedDocumentId],
  );
  const isOwnerOfFocusedDocument = focusedDocument?.userId === userId;
  const [state, dispatch] = useReducer(
    documentMetaReducer,
    documentMetaInitialState,
  );
  useEffect(() => {
    documentMetaActionCreators.init(dispatch);
  }, []);

  const editExistingDocument = showDialog === 'edit';
  useEffect(() => {
    if (editExistingDocument) {
      documentMetaActionCreators.resetToEdit({
        // @ts-ignore
        document: focusedDocument,
      });
    } else {
      setTimeout(
        () => {
          documentMetaActionCreators.resetToCreate({ userId });
        },
        showDialog === 'create' ? 0 : 500,
      );
    }
  }, [showDialog, focusedDocumentId, userId]);
  const inputs = useFormInputs({
    isOnMd,
    isOwnerOfFocusedDocument,
    userId,
    state,
    showDialog,
  });
  const createDocument = useCreateDocument({ state, userId });
  const editDocument = useEditDocument({
    state,
    focusedDocument,
  });

  const apply = useDelayedCallback(
    ac.dialogs.hideDocumentMetaDialog,
    editExistingDocument ? editDocument : createDocument,
  );
  const buttonsRight = useFooterButtons({ apply, editExistingDocument });
  return (
    <DialogWithTransition
      dialogTitle={'Document Properties'}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={ac.dialogs.hideDocumentMetaDialog}
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

const _ = connector(DocumentMetaDialogWithTransition);
const M = memo(_);
export default M;
