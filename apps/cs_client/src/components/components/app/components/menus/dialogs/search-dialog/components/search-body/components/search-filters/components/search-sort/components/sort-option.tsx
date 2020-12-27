import * as React from 'react';
import { useCallback } from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchFilter } from '::sass-modules';
import { ButtonSquare } from '@cherryjuice/components';
import { SearchSortOptions, SortNodesBy } from '@cherryjuice/graphql-types';
import { mapScopeToLabel } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';

export type SortOptionProps = {
  sortBy: SortNodesBy;
  sortOptions: SearchSortOptions;
  setSortBy: (sortBy: SortNodesBy) => void;
};

const SortOption: React.FC<SortOptionProps> = ({
  sortBy,
  sortOptions,
  setSortBy,
}) => {
  const setSortByM = useCallback(() => {
    setSortBy(sortBy);
  }, []);

  return (
    <div className={joinClassNames([modSearchFilter.searchFilter__list__item])}>
      <ButtonSquare
        text={mapScopeToLabel(sortBy)}
        onClick={setSortByM}
        active={sortOptions.sortBy === sortBy}
      />
    </div>
  );
};

export { SortOption };
export { SortOptionProps };
