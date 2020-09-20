import * as React from 'react';
import { SearchTarget } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/search-target';
import { SearchOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-options/search-options';
import { SearchScope } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/search-scope';
import { SearchType } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-type/search-type';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { useRef } from 'react';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { TimeFilters } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/time-filters';
import { SortOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';
import { SortNodesBy } from '::types/graphql/generated';
import { AnimatedDialogHeader } from '::root/components/shared-components/dialog/animations/animated-dialog-filters';

export const useSetCssVariablesOnWindowResize = (
  actionCreator,
  hookDependency1?: boolean,
) => {
  const ref = useRef<HTMLDivElement>();
  const height = useRef(0);
  useOnWindowResize(
    [
      () => {
        const clientHeight = ref.current.clientHeight;
        if (clientHeight !== height.current) {
          height.current = clientHeight;
          actionCreator(clientHeight);
        }
      },
    ],
    hookDependency1,
  );
  return ref;
};

type Props = {
  show: boolean;
};

const mapState = (state: Store) => ({
  dockedDialog: state.root.dockedDialog,
  currentSortOptions: state.search.sortOptions,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const options: { optionName: SortNodesBy }[] = [
  { optionName: SortNodesBy.UpdatedAt },
  { optionName: SortNodesBy.CreatedAt },
  { optionName: SortNodesBy.NodeName },
  { optionName: SortNodesBy.DocumentName },
];

const SearchFilters: React.FC<Props & PropsFromRedux> = ({
  show,
  dockedDialog,
  currentSortOptions,
}) => {
  return (
    <AnimatedDialogHeader show={show} pinned={dockedDialog}>
      <SortOptions
        options={options}
        setSortBy={ac.search.setSortBy}
        toggleSortDirection={ac.search.toggleSortDirection}
        currentSortOptions={currentSortOptions}
        label={'sort nodes by'}
      />
      <SearchTarget />
      <SearchScope />
      <SearchType />
      <SearchOptions />
      <TimeFilters />
    </AnimatedDialogHeader>
  );
};
const _ = connector(SearchFilters);
export { _ as SearchFilters };
