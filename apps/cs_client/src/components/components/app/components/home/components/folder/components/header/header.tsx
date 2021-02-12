import * as React from 'react';
import mod from './header.scss';
import { Search } from '::shared-components/search-input/search';
import { ac } from '::store/store';
import { ToolbarButton } from '::app/components/toolbar/components/toolbar-button/toolbar-button';

export type HeaderProps = {
  folderName: string;
  query: string;
  noSearch?: boolean;
  isOnMd: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  noSearch,
  folderName,
  query,
  isOnMd,
}) => {
  return (
    <div className={mod.header}>
      <span className={mod.header__folderName}>
        {isOnMd && (
          <ToolbarButton
            onClick={ac.home.toggleSidebar}
            icon={'menu'}
            tooltip={'toggle sidebar'}
          />
        )}
        {folderName}
      </span>
      <div className={mod.header__buttons}>
        <Search
          placeholder={'filter documents'}
          providedValue={query}
          onChange={ac.home.setQuery}
          disabled={noSearch}
          hideableInput={'manual'}
          style={{ icon: 'filter' }}
        />
      </div>
    </div>
  );
};
