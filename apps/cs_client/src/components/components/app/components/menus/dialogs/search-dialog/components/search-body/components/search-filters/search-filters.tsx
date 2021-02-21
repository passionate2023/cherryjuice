import * as React from 'react';
import { memo, useRef } from 'react';
import { SearchTarget } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/search-target';
import { SearchOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-options/search-options';
import { SearchScope } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/search-scope';
import { SearchType } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-type/search-type';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { TimeFilters } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/time-filters';
import { SortOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';
import { SortNodesBy } from '@cherryjuice/graphql-types';
import {
  SearchHeaderContainer,
  SearchHeaderGroup,
} from '::root/components/shared-components/dialog/animations/search-header-container';
import { ButtonCircle } from '@cherryjuice/components';
import {
  modPickTimeRange,
  modSearchDialog,
  modSearchFilter,
} from '::sass-modules';
import { Icons } from '@cherryjuice/icons';
import { DocumentSearch } from '::app/components/toolbar/components/nav-bar/components/document-search';
import { ContextMenuWrapper } from '@cherryjuice/components';

export const SearchSetting: React.FC<{
  iconName: string;
  testId: string;
}> = memo(function SearchSetting({ iconName, children, testId }) {
  return (
    <ContextMenuWrapper
      clickOutsideSelectorsWhitelist={[
        {
          selector: '.' + modSearchFilter.searchFilter,
        },
        {
          selector: '.' + modPickTimeRange.pickTimeRange,
        },
      ]}
      showAsModal={'mb'}
      hookProps={{
        getActiveElement: () =>
          document.querySelector(`[data-testid="${testId}"]`),
        getIdOfActiveElement: () => testId,
      }}
      customBody={
        <div className={modSearchDialog.searchDialog__searchSetting}>
          {children}
        </div>
      }
      positionPreferences={{
        positionX: 'rl',
        positionY: 'tt',
        offsetX: 0,
        offsetY: 0,
      }}
    >
      {({ ref, show, shown }) => (
        <ButtonCircle
          className={modSearchDialog.searchDialog__header__toggleFilters}
          iconName={iconName}
          active={shown}
          testId={testId}
          onClick={show}
          _ref={ref}
        />
      )}
    </ContextMenuWrapper>
  );
});

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
  showDialog: boolean;
};

const mapState = (state: Store) => ({
  dockedDialog: state.root.dockedDialog,
  currentSortOptions: state.search.sortOptions,
  mb: state.root.isOnMb,
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
  showDialog,
  mb,
}) => {
  return (
    <SearchHeaderContainer alignChildren={'v'}>
      <SearchHeaderGroup>
        <DocumentSearch
          style={{ elementWidth: mb ? 300 : 400, elementHeight: 50 }}
          navBar={false}
          lazyAutoFocus={showDialog}
        />
      </SearchHeaderGroup>
      <SearchHeaderGroup>
        <SearchSetting
          iconName={Icons.material.sort}
          testId={'toggleSortOptions'}
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
          testId={'toggleFilters'}
        >
          <SearchTarget />
          <SearchScope />
        </SearchSetting>
        <SearchSetting
          iconName={Icons.material.time}
          testId={'toggleTimeFilter'}
        >
          <TimeFilters />
        </SearchSetting>
        <SearchSetting iconName={Icons.material.tune} testId={'toggleTuning'}>
          <SearchType />
          <SearchOptions />
        </SearchSetting>
      </SearchHeaderGroup>
    </SearchHeaderContainer>
  );
};

const _ = connector(SearchFilters);
const M = memo(_);
export { M as SearchFilters };
