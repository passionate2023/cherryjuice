import { ac } from '::store/store';
import { DropdownMenuGroupProps } from '::shared-components/dropdown-menu/components/dropdown-menu-group/dropdown-menu-group';
import { testIds } from '::cypress/support/helpers/test-ids';

export const useGroups = ({
  online,
  documentId,
  userId,
  documentHasUnsavedChanges,
}: {
  online: boolean;
  userId: string;
  documentId: string;
  documentHasUnsavedChanges: boolean;
}): DropdownMenuGroupProps[] => {
  const noDocumentIsSelected = !documentId;
  const newDocument = documentId?.startsWith('new-document');
  return [
    {
      id: 'document',
      body: [
        {
          text: 'new document',
          onClick: ac.dialogs.showCreateDocumentDialog,
          testId: 'new-document',
          disabled: !userId,
        },
        {
          text: 'import document',
          onClick: ac.dialogs.showImportDocument,
          disabled: !userId || !online,
          testId: testIds.dialogs__selectDocument__footerLeft__import,
        },
      ],
    },

    {
      id: 'current-document',
      header: {
        text: 'current document',
      },
      body: [
        {
          text: 'edit',
          onClick: () => ac.dialogs.showEditDocumentDialog(),
          disabled: noDocumentIsSelected,
        },
        {
          text: 'reload',
          onClick: documentHasUnsavedChanges
            ? ac.dialogs.showReloadDocument
            : ac.document.fetch,
          disabled: noDocumentIsSelected || newDocument || !online,
        },
        {
          text: 'cache',
          onClick: () => ac.node.fetchAll(documentId),
          disabled: noDocumentIsSelected || !online || newDocument,
        },
        {
          text: 'clone',
          onClick: () => ac.document.clone(documentId),
          disabled: noDocumentIsSelected || !online,
        },
        {
          text: 'export',
          onClick: () => ac.document.export(documentId),
          disabled: noDocumentIsSelected || !online,
        },
      ],
    },
  ];
};
