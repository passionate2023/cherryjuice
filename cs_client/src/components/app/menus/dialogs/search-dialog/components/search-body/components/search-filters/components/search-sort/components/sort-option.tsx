import * as React from 'react';
import { useCallback } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter, modUtility } from '::sass-modules/';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import {
  SearchSortOptions,
  SortDirection,
  SortNodesBy,
} from '::types/graphql/generated';
import { ac } from '::root/store/store';
import { mapScopeToLabel } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';

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

type SortOptionProps = {
  sortBy: SortNodesBy;
  sortOptions: SearchSortOptions;
};

const SortOption: React.FC<SortOptionProps> = ({ sortBy, sortOptions }) => {
  const setSortByM = useCallback(() => {
    ac.search.setSortBy(sortBy);
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
        onClick={ac.search.toggleSortDirection}
        active={true}
      />
    </div>
  );
};

export { SortOption };
export { SortOptionProps };
