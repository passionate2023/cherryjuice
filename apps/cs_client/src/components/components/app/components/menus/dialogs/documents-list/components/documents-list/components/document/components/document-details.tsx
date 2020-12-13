import * as React from 'react';
import { modDocumentsList } from '::sass-modules';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { Privacy } from '@cherryjuice/graphql-types';
import { TimeStamps } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/time-stamps';
import { joinClassNames } from '::helpers/dom/join-class-names';

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
    <div className={modDocumentsList.documentsList__details}>
      <span className={modDocumentsList.documentsList__details__primary}>
        <VisibilityIcon
          privacy={privacy}
          numberOfGuests={numberOfGuests}
          labelPosition={'bottom-right'}
        />
        <span className={modDocumentsList.documentsList__details__text}>
          {size}kb
        </span>
      </span>

      <div className={`${modDocumentsList.documentsList__details__secondary}`}>
        <span
          className={joinClassNames([
            modDocumentsList.documentsList__details__id,
            modDocumentsList.documentsList__details__text,
          ])}
        >
          {id}
        </span>
        <TimeStamps createdAt={createdAt} updatedAt={updatedAt} />
      </div>
    </div>
  );
};

export { DocumentDetails };
