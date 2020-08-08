import * as React from 'react';
import { modSearchFilter } from '::sass-modules';
import { ac, Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import {
  Filter,
  TimeFilterProps,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/time-filter';

const mapState = (state: Store) => ({
  createdAtTimeFilter: state.search.createdAtTimeFilter,
  updatedAtTimeFilter: state.search.updatedAtTimeFilter,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const TimeFilters: React.FC<Props & PropsFromRedux> = ({
  createdAtTimeFilter,
  updatedAtTimeFilter,
}) => {
  const timeFilters: TimeFilterProps[] = [
    {
      filterName: 'created',
      onChange: ac.search.setCreatedAtTimeFilter,
      timeFilter: createdAtTimeFilter,
    },
    {
      filterName: 'updated',
      onChange: ac.search.setUpdatedAtTimeFilter,
      timeFilter: updatedAtTimeFilter,
    },
  ];
  return (
    <div className={modSearchFilter.searchFilter}>
      <span className={modSearchFilter.searchFilter__label}>
        node time filters
      </span>
      <div className={modSearchFilter.searchFilter__list}>
        {timeFilters.map(props => (
          <Filter {...props} key={props.filterName} />
        ))}
      </div>
    </div>
  );
};
const _ = connector(TimeFilters);
export { _ as TimeFilters };
