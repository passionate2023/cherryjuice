import * as React from 'react';
import { useRef } from 'react';
import { SearchTarget } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/search-target';
import { SearchOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-options/search-options';
import { SearchScope } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/search-scope';
import { SearchType } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-type/search-type';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { TimeFilters } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/time-filters';
import { SortOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';
import { SortNodesBy } from '::types/graphql/generated';
import { SearchHeaderContainer } from '::root/components/shared-components/dialog/animations/search-header-container';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { modSearchDialog } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';

export const SearchSetting: React.FC<{
  iconName: string;
  shown: boolean;
  show: () => void;
  hide: () => void;
}> = ({ iconName, shown, show, hide, children }) => (
  <ContextMenuWrapper
    show={shown}
    hide={hide}
    contextMenu={
      <div className={modSearchDialog.searchDialog__searchSetting}>
        {children}
      </div>
    }
  >
    <ButtonCircle
      className={modSearchDialog.searchDialog__header__toggleFilters}
      onClick={show}
      iconName={iconName}
      active={shown}
    />
  </ContextMenuWrapper>
);

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
  showSortOptions: state.search.showSortOptions,
  showFilters: state.search.showFilters,
  showTuning: state.search.showTuning,
  showTimeFilter: state.search.showTimeFilter,
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
  currentSortOptions,
  showSortOptions,
  showFilters,
  showTuning,
  showTimeFilter,
}) => {
  return (
    <SearchHeaderContainer>
      <SearchSetting
        iconName={Icons.material.sort}
        hide={ac.search.toggleSortOptions}
        show={ac.search.toggleSortOptions}
        shown={showSortOptions}
      >
        <SortOptions
          options={options}
          setSortBy={ac.search.setSortBy}
          toggleSortDirection={ac.search.toggleSortDirection}
          currentSortOptions={currentSortOptions}
          label={'sort nodes by'}
        />
      </SearchSetting>

      <SearchSetting
        iconName={Icons.material.filter}
        hide={ac.search.toggleFilters}
        show={ac.search.toggleFilters}
        shown={showFilters}
      >
        <SearchTarget />
        <SearchScope />
      </SearchSetting>
      <SearchSetting
        iconName={Icons.material.time}
        hide={ac.search.toggleTimeFilter}
        show={ac.search.toggleTimeFilter}
        shown={showTimeFilter}
      >
        <TimeFilters />
      </SearchSetting>
      <SearchSetting
        iconName={Icons.material.tune}
        hide={ac.search.toggleTuning}
        show={ac.search.toggleTuning}
        shown={showTuning}
      >
        <SearchType />
        <SearchOptions />
      </SearchSetting>
    </SearchHeaderContainer>
  );
};

const _ = connector(SearchFilters);
export { _ as SearchFilters };
