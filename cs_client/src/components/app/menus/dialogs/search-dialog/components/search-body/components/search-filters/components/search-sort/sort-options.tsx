import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter } from '::sass-modules';
import { Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { SortNodesBy } from '::types/graphql/generated';
import { SortOption } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/components/sort-option';

const mapState = (state: Store) => ({
  sortOptions: state.search.sortOptions,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SortOptions: React.FC<Props & PropsFromRedux> = ({ sortOptions }) => {
  const options: { optionName: SortNodesBy }[] = [
    { optionName: SortNodesBy.UpdatedAt },
    { optionName: SortNodesBy.CreatedAt },
    { optionName: SortNodesBy.NodeName },
    { optionName: SortNodesBy.DocumentName },
  ];

  return (
    <div className={joinClassNames([modSearchFilter.searchFilter])}>
      <span className={modSearchFilter.searchFilter__label}>search scope</span>
      <div className={modSearchFilter.searchFilter__list}>
        {options.map(args => (
          <SortOption
            key={args.optionName}
            {...args}
            sortBy={args.optionName}
            sortOptions={sortOptions}
          />
        ))}
      </div>
    </div>
  );
};
const _ = connector(SortOptions);
export { _ as SortOptions };
