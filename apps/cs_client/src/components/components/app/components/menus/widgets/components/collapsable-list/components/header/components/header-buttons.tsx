import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { ButtonCircle } from '@cherryjuice/components';
import { EventHandler } from 'react';
import { Icons } from '@cherryjuice/icons';

export type HeaderButtonsProps = {
  collapsed: boolean;
  toggleCollapsed: EventHandler<any>;
  additionalHeaderButtons?: JSX.Element;
};

const HeaderButtons: React.FC<HeaderButtonsProps> = ({
  toggleCollapsed,
  collapsed,
  additionalHeaderButtons,
}) => {
  return (
    <span className={modDocumentOperations.collapsableList__header__action}>
      {!collapsed && additionalHeaderButtons}
      <ButtonCircle
        onClick={toggleCollapsed}
        iconName={
          collapsed ? Icons.material['arrow-up'] : Icons.material['arrow-down']
        }
      />
    </span>
  );
};

export { HeaderButtons };
