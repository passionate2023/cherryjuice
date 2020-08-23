import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { Search } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/components/search/search';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ac } from '::store/store';

type Props = {
  showFilters: boolean;
};

const SearchHeader: React.FC<Props> = ({ showFilters }) => {
  return (
    <div className={modSearchDialog.searchDialog__header}>
      <Search
        className={modSearchDialog.searchDialog__header__searchField}
        navBar={false}
      />
      <ButtonCircle
        className={modSearchDialog.searchDialog__header__toggleFilters}
        onClick={ac.search.toggleFilters}
        icon={<Icon name={Icons.material.tune} loadAsInlineSVG={'force'} />}
        active={showFilters}
      />
    </div>
  );
};

export { SearchHeader };
