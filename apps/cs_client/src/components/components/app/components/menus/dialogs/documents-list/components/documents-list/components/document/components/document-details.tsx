import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { dateToFormattedString } from '::helpers/time';
import { Privacy } from '@cherryjuice/graphql-types';

type Props = {
  id: string;
  hash: string;
  updatedAt: number;
  numberOfGuests: number;
  size: number;
  privacy: Privacy;
};

const DocumentDetails: React.FC<Props> = ({
  privacy,
  numberOfGuests,
  size,
  id,
  hash,
  updatedAt,
}) => {
  return (
    <>
      <span className={modSelectFile.selectFile__file__details__visibility}>
        <VisibilityIcon privacy={privacy} numberOfGuests={numberOfGuests} />
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
    </>
  );
};

export { DocumentDetails };
