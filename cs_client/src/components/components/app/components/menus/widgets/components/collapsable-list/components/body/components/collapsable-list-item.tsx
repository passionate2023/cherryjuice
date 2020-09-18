import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';

export type CollapsableListItemProps = {
  name: string;
  description: string;
  button?: JSX.Element;
};
const CollapsableListItem: React.FC<CollapsableListItemProps> = ({ name, description, button }) => {
  return (
    <div className={modDocumentOperations.documentOperations__document}>
      <div className={modDocumentOperations.documentOperations__document__name}>
        {name}
      </div>
      <div
        className={modDocumentOperations.documentOperations__document__status}
      >
        {description}
      </div>
      {button}
    </div>
  );
};

export { CollapsableListItem };
