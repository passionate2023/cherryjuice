import * as React from 'react';
import { modSearchDialog } from '::sass-modules/';
import { SearchResults } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/search-results';
import { Search } from '::app/editor/tool-bar/groups/nav-bar/components/search/search';
import { SearchScope } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-scope/search-scope';
import { SearchType } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-type/search-type/search-type';
import { useOnKeyPress } from '::hooks/use-on-key-up';
import { ac } from '::root/store/store';
import { useRef } from 'react';

type Props = {};

const SearchBody: React.FC<Props> = () => {
  const ref = useRef<HTMLDivElement>();
  useOnKeyPress({
    ref,
    keys: ['Enter', 'Space'],
    onClick: ac.search.setSearchQueued,
  });
  return (
    <div className={modSearchDialog.searchDialog} ref={ref}>
      <div className={modSearchDialog.searchDialog__searchSettings}>
        <Search
          className={modSearchDialog.searchDialog__searchSettings__searchField}
          navBar={false}
        />
        <div
          className={
            modSearchDialog.searchDialog__searchSettings__searchFilters
          }
        >
          <SearchScope />
          <SearchType />
        </div>
      </div>
      <SearchResults />
    </div>
  );
};

export { SearchBody };
