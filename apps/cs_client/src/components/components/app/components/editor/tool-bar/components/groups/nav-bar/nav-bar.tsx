import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { DocumentSearch } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/search/document-search';
import { UserButton } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/user-button';
import { DocumentButton } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/document-button';

type Props = Record<string, never>;

const NavBar: React.FC<Props> = () => {
  return (
    <div
      className={
        modToolbar.toolBar__group + ' ' + modToolbar.toolBar__groupNavBar
      }
    >
      <DocumentSearch />
      <DocumentButton />
      <UserButton />
    </div>
  );
};
export { NavBar };
