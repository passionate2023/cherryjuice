import * as React from 'react';
import { useGroups } from './hooks/groups';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { DropdownMenu } from '::shared-components/dropdown-menu/dropdown-menu';
import { documentHasUnsavedChanges } from '::app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
import { testIds } from '::cypress/support/helpers/test-ids';

const mapState = (state: Store) => {
  const documentId = state.document.documentId;
  const document = state.documentCache.documents[documentId];
  return {
    documentId: documentId,
    online: state.root.online,
    show: state.dialogs.showDocumentDropdownMenu,
    documentHasUnsavedChanges: documentHasUnsavedChanges(document),
    userId: state.auth.user?.id,
  };
};
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = {
  includeCurrentDocumentSection?: boolean;
};
const DocumentDropdownMenu: React.FC<Props & PropsFromRedux> = ({
  online,
  documentId,
  show,
  documentHasUnsavedChanges,
  userId,
  includeCurrentDocumentSection = true,
}) => {
  const elements = useGroups({
    online,
    documentId,
    userId,
    documentHasUnsavedChanges,
    includeCurrentDocumentSection,
  });
  return (
    show && (
      <DropdownMenu
        groups={elements}
        hide={ac.dialogs.hideDocumentDropdownMenu}
        xOffset={-5}
        assertions={[
          {
            selector: `[data-testid="${testIds.toolBar__navBar__documentButton}"]`,
          },
        ]}
      />
    )
  );
};

const _ = connector(DocumentDropdownMenu);
export { _ as DocumentDropdownMenu };
