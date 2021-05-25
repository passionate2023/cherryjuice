import { HomeReducerState, SortDocumentsBy } from '::store/ducks/home/home';
import { SortDirection } from '@cherryjuice/graphql-types';

export type SetSortByPayload = {
  sortBy: SortDocumentsBy;
};

const toggleSortDirection = (sortDirection: SortDirection) =>
  sortDirection === SortDirection.Ascending
    ? SortDirection.Descending
    : SortDirection.Ascending;

export const setSortBy = (
  state: HomeReducerState,
  { sortBy }: SetSortByPayload,
): HomeReducerState => {
  const sameSortBy = state.sortBy === sortBy;
  return {
    ...state,
    sortDirection: sameSortBy
      ? toggleSortDirection(state.sortDirection)
      : state.sortDirection,
    sortBy,
  };
};
