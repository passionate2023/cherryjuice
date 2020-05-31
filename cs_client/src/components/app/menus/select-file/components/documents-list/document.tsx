import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { dateToFormattedString } from '::helpers/time';
import { EventHandler } from 'react';
import { useMouseHold } from '::hooks/dom/mouse-hold';
type Props = {
  selectedIDs: string[];
  id: string;
  documentId: string;
  name: string;
  size: number;
  updatedAt: number;
  onSelect: EventHandler<any>;
};

const Document: React.FC<Props> = ({
  size,
  id,
  name,
  selectedIDs,
                                     documentId,
  updatedAt,
  onSelect,
}) => {
  const mouseHoldHandlers = useMouseHold({
    onMouseHold: onSelect,
    callbackProps: { id, holding: true },
    minHoldDuration: 500,
  });
  return (
    <div
      {...mouseHoldHandlers}
      className={`${modSelectFile.selectFile__file} ${
        selectedIDs.includes(id)
          ? modSelectFile.selectFile__fileSelectedCandidate
          : ''
      } ${documentId === id ? modSelectFile.selectFile__fileSelected : ''}`}
      onClick={() => onSelect({ id })}
      key={id}
      tabIndex={0}
    >
      <span className={`${modSelectFile.selectFile__file__name} `}>{name}</span>

      <span className={`${modSelectFile.selectFile__file__details} `}>
        <span>{size / 1024}kb</span>
        <span>{dateToFormattedString(new Date(updatedAt))}</span>
      </span>
    </div>
  );
};

export { Document };
