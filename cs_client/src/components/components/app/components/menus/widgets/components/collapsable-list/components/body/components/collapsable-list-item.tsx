import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';

export type CollapsableListItemProps = {
  name: string;
  description: string;
  button?: JSX.Element;
  active?: boolean;
};
const CollapsableListItem: React.FC<CollapsableListItemProps> = ({
  name,
  description,
  button,
  active,
}) => {
  return (
    <div
      className={joinClassNames([
        modDocumentOperations.collapsableList__item,
        [modDocumentOperations.collapsableList__itemActive, active],
      ])}
    >
      <div className={modDocumentOperations.collapsableList__item__name}>
        {name}
      </div>
      <div className={modDocumentOperations.collapsableList__item__description}>
        {description}
      </div>
      {button}
    </div>
  );
};

export { CollapsableListItem };
