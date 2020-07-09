import * as React from 'react';
import { modSearchDialog } from '::sass-modules/';
import { SearchResults } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/search-results';
import { Search } from '::app/editor/tool-bar/groups/nav-bar/components/search/search';
import { SearchScope } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-scope/search-scope';
import { SearchTarget } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-type/search-target';

type Props = {};

const SearchBody: React.FC<Props> = () => {
  return (
    <div className={modSearchDialog.searchDialog}>
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
          <SearchTarget />
        </div>
      </div>
      <SearchResults />
    </div>
  );
};

export { SearchBody };
