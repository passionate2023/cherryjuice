import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { Privacy } from '@cherryjuice/graphql-types';
import { TimeStamps } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/time-stamps';

type Props = {
  id: string;
  hash: string;
  updatedAt: number;
  createdAt: number;
  numberOfGuests: number;
  size: number;
  privacy: Privacy;
};

const DocumentDetails: React.FC<Props> = ({
  privacy,
  numberOfGuests,
  size,
  id,
  updatedAt,
  createdAt,
}) => {
  return (
    <>
      <span className={modSelectFile.selectFile__file__details__visibility}>
        <VisibilityIcon privacy={privacy} numberOfGuests={numberOfGuests} />
        <span>{size}kb</span>
      </span>

      <div className={`${modSelectFile.selectFile__file__details}`}>
        <span className={`${modSelectFile.selectFile__file__details__id}`}>
          {id}
        </span>
        <TimeStamps createdAt={createdAt} updatedAt={updatedAt} />
      </div>
    </>
  );
};

export { DocumentDetails };
