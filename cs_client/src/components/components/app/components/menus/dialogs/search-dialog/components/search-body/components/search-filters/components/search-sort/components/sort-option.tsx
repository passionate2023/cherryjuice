import * as React from 'react';
import { useCallback } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter, modUtility } from '::sass-modules';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import {
  SearchSortOptions,
  SortDirection,
  SortNodesBy,
} from '::types/graphql/generated';
import { mapScopeToLabel } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';

const mapDirectionToLabel = ({
  sortBy,
  sortDirection,
}: SearchSortOptions): string => {
  if (sortBy === SortNodesBy.UpdatedAt || sortBy === SortNodesBy.CreatedAt)
    if (sortDirection === SortDirection.Descending) return 'recent';
    else return 'old';
  else if (
    sortBy === SortNodesBy.DocumentName ||
    sortBy === SortNodesBy.NodeName
  )
    if (sortDirection === SortDirection.Ascending) return 'a ▶ z';
    else return 'z ▶ a';
};

export type SortOptionProps = {
  sortBy: SortNodesBy;
  sortOptions: SearchSortOptions;
  setSortBy: (sortBy: SortNodesBy) => void;
  toggleSortDirection: () => void;
};

const SortOption: React.FC<SortOptionProps> = ({
  sortBy,
  sortOptions,
  setSortBy,
  toggleSortDirection,
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
      <ButtonSquare
        text={mapDirectionToLabel({
          sortBy,
          sortDirection: sortOptions.sortDirection,
        })}
        className={joinClassNames([
          [modUtility.hidden, sortOptions.sortBy !== sortBy],
          modUtility.fontSize12,
        ])}
        onClick={toggleSortDirection}
        active={true}
      />
    </div>
  );
};

export { SortOption };
export { SortOptionProps };
