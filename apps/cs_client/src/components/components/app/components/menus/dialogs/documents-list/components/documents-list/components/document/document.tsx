import * as React from 'react';
import { ac } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { CachedDocument } from '::store/ducks/document-cache/document-cache';
import { DialogListItem } from '::root/components/shared-components/dialog/dialog-list/dialog-list-item';
import { DocumentDetails } from '::root/components/app/components/menus/dialogs/documents-list/components/documents-list/components/document/components/document-details';

export const documentHasUnsavedChanges = (document: CachedDocument) =>
  document?.localState?.localUpdatedAt > document?.updatedAt;

const mapState = (state: Store, props: Props) => ({
  isSelected: state.documentsList.selectedIDs.includes(props.document.id),
  deletionMode: state.documentsList.deletionMode,
  openDocumentId: state.document.documentId,
  online: state.root.online,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  document: CachedDocument;
};
const Document: React.FC<Props & PropsFromRedux> = ({
  document,
  isSelected,
  openDocumentId,
  deletionMode,
  online,
}) => {
  const {
    nodes,
    size,
    id,
    name,
    updatedAt,
    hash,
    privacy,
    guests,
    createdAt,
  } = document;
  const disabled = !online && (!nodes || (nodes && !nodes[0]));
  const contextMenuOptions = [
    {
      name: 'edit',
      onClick: () => ac.dialogs.showEditDocumentDialog(id),
    },
    {
      name: 'cache',
      onClick: () => ac.node.fetchAll(id),
      disabled: !online || id.startsWith('new-document'),
    },
    {
      name: 'clone',
      onClick: () => ac.document.clone(id),
      disabled: !online,
    },
    {
      name: 'export',
      onClick: () => ac.document.export(id),
      disabled: !online,
    },
    {
      name: 'delete',
      onClick: () => ac.dialogs.showDeleteDocument(),
      disabled: !online,
    },
  ];
  return (
    <DialogListItem
      selected={isSelected}
      active={!deletionMode && openDocumentId === id}
      disabled={disabled}
      name={
        id.startsWith('new-document') || documentHasUnsavedChanges(document)
          ? `*${name}`
          : name
      }
      onClick={() => ac.documentsList.selectDocument(id)}
      contextMenuOptions={contextMenuOptions}
      details={
        <DocumentDetails
          id={id}
          privacy={privacy}
          numberOfGuests={guests.length}
          size={size}
          updatedAt={updatedAt}
          createdAt={createdAt}
          hash={hash}
        />
      }
    />
  );
};

const _ = connector(Document);
export { _ as Document };
