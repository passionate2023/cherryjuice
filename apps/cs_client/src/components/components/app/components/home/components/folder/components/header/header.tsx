import * as React from 'react';
import mod from './header.scss';
import { SearchInput } from '::shared-components/inputs/search-input';
import { ac } from '::store/store';
import { UserButton } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/user-button';
import { DocumentButton } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/document-button';
export type HeaderProps = {
  folderName: string;
  query: string;
  noSearch: boolean;
};
// const noop = () => undefined;
export const Header: React.FC<HeaderProps> = ({
  noSearch,
  folderName,
  query,
}) => {
  return (
    <div className={mod.header}>
      <span className={mod.header__folderName}>{folderName}</span>
      <div className={mod.header__buttons}>
        <SearchInput
          containerClassName={mod.header__searchInput}
          placeHolder={'filter documents'}
          value={query}
          onChange={ac.home.setQuery}
          onClear={ac.home.clearQuery}
          searchImpossible={noSearch}
        />
        <DocumentButton includeCurrentDocumentSection={false} />
        <UserButton />
      </div>
    </div>
  );
};
