import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { dateToFormattedString } from '::helpers/time';
import { EventHandler } from 'react';
import { ThreeDotsButton } from './components/three-dots-button';
import { ac } from '::root/store/store';
import { DocumentMeta } from '::types/graphql/adapters';
type Props = {
  selectedIDs: string[];
  documentId: string;
  onSelect: EventHandler<any>;
  documentMeta: DocumentMeta;
  deleteMode: boolean;
};

const Document: React.FC<Props> = ({
  documentMeta: { size, id, name, updatedAt, hash },
  selectedIDs,
  documentId,
  onSelect,
  deleteMode,
}) => {
  return (
    <div
      className={`${modSelectFile.selectFile__file} ${
        selectedIDs.includes(id)
          ? modSelectFile.selectFile__fileSelectedCandidate
          : ''
      } ${
        !deleteMode && documentId === id
          ? modSelectFile.selectFile__fileSelected
          : ''
      }`}
      onClick={() => {
        onSelect({ id });
        ac.documentsList.setFocusedDocumentId(id);
      }}
      key={id}
      tabIndex={0}
    >
      <span className={`${modSelectFile.selectFile__file__name} `}>
        {id.startsWith('new-document') ? `*${name}` : name}
      </span>
      <ThreeDotsButton documentId={id} />

      <span className={`${modSelectFile.selectFile__file__details} `}>
        <span>{size}kb</span>
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

export { Document };
