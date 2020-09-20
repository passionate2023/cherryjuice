import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { Search } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/components/search/search';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ac } from '::store/store';
import { SearchHeaderContainer } from '::root/components/shared-components/dialog/animations/search-header-container';

type Props = {
  showFilters: boolean;
  show: boolean;
};

const SearchHeader: React.FC<Props> = ({ showFilters, show }) => {
  return (
    <SearchHeaderContainer>
      <Search
        className={modSearchDialog.searchDialog__header__searchField}
        navBar={false}
        lazyAutoFocus={show ? 1200 : 0}
      />
      <ButtonCircle
        className={modSearchDialog.searchDialog__header__toggleFilters}
        onClick={ac.search.toggleFilters}
        icon={<Icon name={Icons.material.tune} loadAsInlineSVG={'force'} />}
        active={showFilters}
      />
    </SearchHeaderContainer>
  );
};

export { SearchHeader };
