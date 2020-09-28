import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Icon } from '::root/components/shared-components/icon/icon';

export type CollapsableListItemProps = {
  name: string;
  description: string;
  button?: JSX.Element;
  active?: boolean;
  key: string;
  icon?: string;
};
const CollapsableListItem: React.FC<CollapsableListItemProps> = ({
  name,
  description,
  button,
  active,
  icon,
}) => {
  return (
    <div
      className={joinClassNames([
        modDocumentOperations.collapsableList__item,
        [modDocumentOperations.collapsableList__itemActive, active],
      ])}
    >
      <div className={modDocumentOperations.collapsableList__item__name}>
        {icon && <Icon name={icon} size={15} />}
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
