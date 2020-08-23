import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { dateToFormattedString } from '::helpers/time';
import { ThreeDotsButton } from './components/three-dots-button';
import { ac } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { CachedDocument } from '::store/ducks/cache/document-cache';

export const documentHasUnsavedChanges = (document: CachedDocument) =>
  document?.state?.localUpdatedAt > document?.updatedAt;

const mapState = (state: Store, props: Props) => ({
  isSelected: state.documentsList.selectedIDs.includes(props.document.id),
  deletionMode: state.documentsList.deletionMode,
  openDocumentId: state.document.documentId,
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
}) => {
  const { size, id, name, updatedAt, hash, privacy } = document;
  return (
    <div
      className={`${modSelectFile.selectFile__file} ${
        isSelected ? modSelectFile.selectFile__fileSelectedCandidate : ''
      } ${
        !deletionMode && openDocumentId === id
          ? modSelectFile.selectFile__fileSelected
          : ''
      }`}
      onClick={() => ac.documentsList.selectDocument(id)}
      key={id}
      tabIndex={0}
    >
      <span className={`${modSelectFile.selectFile__file__name} `}>
        {id.startsWith('new-document') || documentHasUnsavedChanges(document)
          ? `*${name}`
          : name}
      </span>
      <ThreeDotsButton documentId={id} />

      <span className={`${modSelectFile.selectFile__file__details} `}>
        <span className={modSelectFile.selectFile__file__details__visibility}>
          <VisibilityIcon privacy={privacy} />
          <span>{size}kb</span>
        </span>

        <div>
          <span className={`${modSelectFile.selectFile__file__details__id}`}>
            {id}
          </span>
          <span className={`${modSelectFile.selectFile__file__details__hash}`}>
            {hash}
          </span>
          <span>{dateToFormattedString(new Date(updatedAt))}</span>
        </div>
      </span>
    </div>
  );
};

const _ = connector(Document);
export { _ as Document };
