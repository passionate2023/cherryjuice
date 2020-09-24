import * as React from 'react';
import { Search } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/components/search/search';
import { SearchHeaderContainer } from '::root/components/shared-components/dialog/animations/search-header-container';
import { modSearchDialog } from '::sass-modules';

type Props = {
  show: boolean;
};

const SearchHeader: React.FC<Props> = ({ show }) => {
  return (
    <>
      <SearchHeaderContainer>
        <Search
          className={modSearchDialog.searchDialog__header__field}
          navBar={false}
          lazyAutoFocus={show ? 1200 : 0}
        />
      </SearchHeaderContainer>
    </>
  );
};

export { SearchHeader };
