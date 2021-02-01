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
import { useEditDocument } from '::app/components/menus/dialogs/document-meta/hooks/edit-document';
import { useFormInputs } from '::app/components/menus/dialogs/document-meta/hooks/inputs';

const mapState = (state: Store) => ({
  currentFolderId: state.home.folder.id,
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
  showDialog: boolean;
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

  useEffect(() => {
    if (showDialog) {
      documentMetaActionCreators.resetToEdit({
        // @ts-ignore
        document: focusedDocument,
      });
    }
  }, [showDialog, focusedDocumentId, userId]);
  const inputs = useFormInputs({
    isOnMd,
    isOwnerOfFocusedDocument,
    userId,
    state,
  });
  const editDocument = useEditDocument({
    state,
    focusedDocument,
  });

  const apply = useDelayedCallback(
    ac.dialogs.hideDocumentMetaDialog,
    editDocument,
  );
  const buttonsRight = useFooterButtons({ apply });
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
