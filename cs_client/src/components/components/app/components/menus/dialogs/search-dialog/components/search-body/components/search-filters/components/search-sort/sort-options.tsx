import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { SearchSortOptions, SortNodesBy } from '::types/graphql/generated';
import {
  SortOption,
  SortOptionProps,
} from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/components/sort-option';

const mapState = () => ({});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  options: { optionName: SortNodesBy }[];
  currentSortOptions: SearchSortOptions;
  label: string;
} & Pick<SortOptionProps, 'setSortBy' | 'toggleSortDirection'>;

const SortOptions: React.FC<Props & PropsFromRedux> = ({
  currentSortOptions,
  options,
  toggleSortDirection,
  setSortBy,
  label,
}) => {
  return (
    <div className={joinClassNames([modSearchFilter.searchFilter])}>
      <span className={modSearchFilter.searchFilter__label}>{label}</span>
      <div className={modSearchFilter.searchFilter__list}>
        {options.map(({ optionName, ...args }) => (
          <SortOption
            key={optionName}
            {...args}
            sortBy={optionName}
            sortOptions={currentSortOptions}
            setSortBy={setSortBy}
            toggleSortDirection={toggleSortDirection}
          />
        ))}
      </div>
    </div>
  );
};
const _ = connector(SortOptions);
export { _ as SortOptions };
