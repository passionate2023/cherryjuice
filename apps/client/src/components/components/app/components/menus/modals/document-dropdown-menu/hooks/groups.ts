import { ac } from '::store/store';
import { DropdownMenuGroupProps } from '::shared-components/dropdown-menu/components/dropdown-menu-group/dropdown-menu-group';
import { testIds } from '@cherryjuice/test-ids';
import { createDocument } from '::app/components/menus/modals/document-dropdown-menu/callbacks/create-document/create-document';
import { Privacy } from '@cherryjuice/graphql-types';

export const useGroups = ({
  online,
  documentId,
  userId,
  documentHasUnsavedChanges,
  includeCurrentDocumentSection,
  currentFolderId,
  isOwnerOfDocument,
}: {
  online: boolean;
  userId: string;
  documentId: string;
  documentHasUnsavedChanges: boolean;
  includeCurrentDocumentSection: boolean;
  isOwnerOfDocument: boolean;
  currentFolderId: string;
}): DropdownMenuGroupProps[] => {
  const noDocumentIsSelected = !documentId;
  const newDocument = documentId?.startsWith('new-document');

  return [
    {
      id: 'document',
      body: [
        {
          text: 'new document',
          onClick: () =>
            createDocument({
              currentFolderId,
              userId,
              state: {
                guests: [],
                name: 'new document',
                privacy: Privacy.PRIVATE,
              },
            }),
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

    includeCurrentDocumentSection && {
      id: 'current-document',
      header: {
        text: 'current document',
      },
      body: [
        {
          text: 'edit',
          onClick: () => ac.dialogs.showEditDocumentDialog(),
          disabled: noDocumentIsSelected || !isOwnerOfDocument,
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
  ].filter(Boolean);
};
