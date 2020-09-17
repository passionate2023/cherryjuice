import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { dateToFormattedString } from '::helpers/time';
import { ThreeDotsButton } from './components/three-dots-button';
import { ac } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { joinClassNames } from '::helpers/dom/join-class-names';

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
  const { nodes, size, id, name, updatedAt, hash, privacy, guests } = document;
  const disabled = !online && (!nodes || (nodes && !nodes[0]));
  return (
    <div
      className={joinClassNames([
        modSelectFile.selectFile__file,
        [modSelectFile.selectFile__fileSelectedCandidate, isSelected],
        [
          modSelectFile.selectFile__fileSelected,
          !deletionMode && openDocumentId === id,
        ],
      ])}
      onClick={disabled ? undefined : () => ac.documentsList.selectDocument(id)}
      key={id}
      tabIndex={0}
    >
      <div
        className={joinClassNames([
          modSelectFile.selectFile__file__body,
          [modSelectFile.selectFile__file__bodyDisabled, disabled],
        ])}
      >
        <span className={`${modSelectFile.selectFile__file__name} `}>
          {id.startsWith('new-document') || documentHasUnsavedChanges(document)
            ? `*${name}`
            : name}
        </span>

        <span className={`${modSelectFile.selectFile__file__details} `}>
          <span className={modSelectFile.selectFile__file__details__visibility}>
            <VisibilityIcon privacy={privacy} numberOfGuests={guests.length} />
            <span>{size}kb</span>
          </span>

          <div>
            <span className={`${modSelectFile.selectFile__file__details__id}`}>
              {id}
            </span>
            <span
              className={`${modSelectFile.selectFile__file__details__hash}`}
            >
              {hash}
            </span>
            <span>{dateToFormattedString(new Date(updatedAt))}</span>
          </div>
        </span>
      </div>
      <ThreeDotsButton documentId={id} online={online} />
    </div>
  );
};

const _ = connector(Document);
export { _ as Document };
