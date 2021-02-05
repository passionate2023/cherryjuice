import * as React from 'react';
import { useGroups } from './hooks/groups';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { DropdownMenu } from '::shared-components/dropdown-menu/dropdown-menu';
import { documentHasUnsavedChanges } from '::app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
import { testIds } from '::cypress/support/helpers/test-ids';

const mapState = (state: Store) => {
  const documentId = state.document.documentId;
  const document = state.documentCache.documents[documentId];
  const userId = state.auth.user?.id;
  return {
    documentId: documentId,
    isOwnerOfDocument: document?.userId === userId,
    online: state.root.online,
    documentHasUnsavedChanges: documentHasUnsavedChanges(document),
    userId: userId,
    currentFolderId: state.home.folder?.id,
  };
};
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = {
  includeCurrentDocumentSection?: boolean;
  hide: () => undefined;
};
const DocumentDropdownMenu: React.FC<Props & PropsFromRedux> = ({
  online,
  documentId,
  hide,
  documentHasUnsavedChanges,
  userId,
  includeCurrentDocumentSection = true,
  currentFolderId,
  isOwnerOfDocument,
}) => {
  const elements = useGroups({
    online,
    documentId,
    userId,
    documentHasUnsavedChanges,
    includeCurrentDocumentSection,
    currentFolderId,
    isOwnerOfDocument,
  });
  return (
    <DropdownMenu
      groups={elements}
      hide={hide}
      assertions={[
        {
          selector: `[data-testid="${testIds.toolBar__navBar__documentButton}"]`,
        },
      ]}
    />
  );
};

const _ = connector(DocumentDropdownMenu);
export { _ as DocumentDropdownMenu };
