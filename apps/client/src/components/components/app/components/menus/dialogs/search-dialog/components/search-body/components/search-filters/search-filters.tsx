import * as React from 'react';
import { memo } from 'react';
import { SearchTarget } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/search-target';
import { SearchOptions } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-options/search-options';
import { SearchScope } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/search-scope';
import { SearchType } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-type/search-type';
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
import { Popper } from '@cherryjuice/components';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

export const SearchSetting: React.FC<{
  iconName: string;
  testId: string;
}> = memo(function SearchSetting({ iconName, children, testId }) {
  return (
    <Popper
      clickOutsideSelectorsWhitelist={[
        {
          selector: '.' + modSearchFilter.searchFilter,
        },
        {
          selector: '.' + modPickTimeRange.pickTimeRange,
        },
      ]}
      showAsModal={'mb'}
      getContext={{
        getActiveElement: () =>
          document.querySelector(`[data-testid="${testId}"]`),
        getIdOfActiveElement: () => testId,
      }}
      body={
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
    </Popper>
  );
});

type Props = {
  show: boolean;
  showDialog: boolean;
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
  currentSortOptions,
  showDialog,
}) => {
  const { mb } = useCurrentBreakpoint();
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
