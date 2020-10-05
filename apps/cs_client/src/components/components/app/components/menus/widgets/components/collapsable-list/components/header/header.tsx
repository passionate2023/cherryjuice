import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { HeaderButtons, HeaderButtonsProps } from './components/header-buttons';
import { HeaderText, HeaderTextProps } from './components/header-text';

export type HeaderProps = HeaderTextProps & HeaderButtonsProps;
const Header: React.FC<HeaderProps> = ({
  collapsed,
  toggleCollapsed,
  text,
  additionalHeaderButtons,
}) => {
  return (
    <div className={modDocumentOperations.collapsableList__header}>
      {!collapsed && <HeaderText text={text} />}
      <HeaderButtons
        toggleCollapsed={toggleCollapsed}
        collapsed={collapsed}
        additionalHeaderButtons={additionalHeaderButtons}
      />
    </div>
  );
};

export { Header };
