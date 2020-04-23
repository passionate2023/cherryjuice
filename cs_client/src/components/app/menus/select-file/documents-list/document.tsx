import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { dateToFormattedString } from '::helpers/time';
import { EventHandler } from 'react';
type Props = {
  selected: { id: string };
  id: string;
  selectedFile: string;
  folder: string;
  name: string;
  size: number;
  updatedAt: number;
  onSelect: EventHandler<any>;
};

const Document: React.FC<Props> = ({
  size,
  folder,
  id,
  name,
  selected,
  selectedFile,
  updatedAt,
  onSelect,
}) => {
  return (
    <span
      className={`${modSelectFile.selectFile__file} ${
        selected.id === id
          ? modSelectFile.selectFile__fileSelectedCandidate
          : ''
      } ${selectedFile === id ? modSelectFile.selectFile__fileSelected : ''}`}
      data-id={id}
      data-folder={folder}
      onClick={onSelect}
      key={id}
      tabIndex={0}
    >
      <span className={`${modSelectFile.selectFile__file__name} `}>{name}</span>

      <span className={`${modSelectFile.selectFile__file__details} `}>
        <span>{size / 1024}kb</span>
        <span>{dateToFormattedString(new Date(updatedAt))}</span>
      </span>
    </span>
  );
};

export { Document };
