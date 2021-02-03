import * as React from 'react';
import mod from './header.scss';
import { Search } from '::shared-components/search-input/search';
import { ac } from '::store/store';
import { UserButton } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/user-button';
import { DocumentButton } from '::app/components/editor/tool-bar/components/groups/nav-bar/components/document-button';
import { ToolbarButton } from '@cherryjuice/components';
import { useState } from 'react';
export type HeaderProps = {
  folderName: string;
  query: string;
  noSearch?: boolean;
  isOnMd: boolean;
};
// const noop = () => undefined;
export const Header: React.FC<HeaderProps> = ({
  noSearch,
  folderName,
  query,
  isOnMd,
}) => {
  const [inputShown, setInputShown] = useState(false);
  return (
    <div className={mod.header}>
      <span className={mod.header__folderName}>
        {isOnMd && (
          <ToolbarButton
            onClick={ac.home.toggleSidebar}
            icon={'menu'}
            tooltip={{ label: 'toggle sidebar', position: 'bottom-right' }}
          />
        )}
        {folderName}
      </span>
      <div className={mod.header__buttons}>
        <Search
          // containerClassName={mod.header__searchInput}
          placeholder={'filter documents'}
          providedValue={query}
          onChange={ac.home.setQuery}
          disabled={noSearch}
          hideableInput={'manual'}
          onInputShown={setInputShown}
        />
        {!inputShown && (
          <>
            <DocumentButton includeCurrentDocumentSection={false} />
            <UserButton />
          </>
        )}
      </div>
    </div>
  );
};
