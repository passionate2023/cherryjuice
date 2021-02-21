import * as React from 'react';
import mod from './header.scss';
import { Search } from '::shared-components/search-input/search';
import { ac } from '::store/store';
import { ButtonCircle, Tooltip } from '@cherryjuice/components';

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
          <Tooltip tooltip={'toggle sidebar'}>
            {bind => (
              <ButtonCircle
                onClick={ac.home.toggleSidebar}
                iconName={'menu'}
                iconSize={16}
                {...bind}
              />
            )}
          </Tooltip>
        )}
        <span>{folderName}</span>
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
