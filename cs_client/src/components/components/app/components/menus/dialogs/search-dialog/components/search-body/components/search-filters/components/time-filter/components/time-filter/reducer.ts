import { TimeFilter, TimeRange } from '::types/graphql/generated';
import { mapRangeNameToTimeFilter } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/helpers/map-range-name-to-time-filter';
import { EmptyTimeFilter } from '::store/ducks/search';

type State = {
  showCustomRangePicker: boolean;
  timeFilter?: TimeFilter;
};
const initialState: State = {
  showCustomRangePicker: false,
  timeFilter: undefined,
};

enum actions {
  showCustomRangePicker,
  hideCustomRangePicker,
  setCustomTimeFilter,
  setPredefinedTimeFilter,
  clearCustomTimeFilter,
  toggleTimeFilter,
}

const createActionCreators = () => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: dispatch => (state.dispatch = dispatch),
    showCustomRangePicker: () =>
      state.dispatch({ type: actions.showCustomRangePicker }),
    toggleTimeFilter: () => state.dispatch({ type: actions.toggleTimeFilter }),
    hideCustomRangePicker: () =>
      state.dispatch({ type: actions.hideCustomRangePicker }),
    clearCustomTimeFilter: () =>
      state.dispatch({ type: actions.clearCustomTimeFilter }),
    setCustomTimeFilter: (value: TimeFilter) =>
      state.dispatch({ type: actions.setCustomTimeFilter, value }),
    setPredefinedTimeFilter: (value: TimeRange) =>
      state.dispatch({ type: actions.setPredefinedTimeFilter, value }),
  };
};

const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  switch (action.type) {
    case actions.showCustomRangePicker:
      return { ...state, showCustomRangePicker: true };
    case actions.hideCustomRangePicker:
      return {
        ...state,
        showCustomRangePicker: false,
        timeFilter: state.timeFilter.rangeStart
          ? state.timeFilter
          : mapRangeNameToTimeFilter(TimeRange.PastYear),
      };
    case actions.toggleTimeFilter:
      return {
        ...state,
        timeFilter:
          state.timeFilter.rangeName === TimeRange.AnyTime
            ? mapRangeNameToTimeFilter(TimeRange.PastYear)
            : EmptyTimeFilter,
      };
    case actions.setCustomTimeFilter:
      return {
        ...state,
        timeFilter: (action.value as TimeFilter).rangeStart
          ? action.value
          : EmptyTimeFilter,
      };
    case actions.clearCustomTimeFilter:
      return {
        ...state,
        timeFilter: mapRangeNameToTimeFilter(TimeRange.PastYear),
      };
    case actions.setPredefinedTimeFilter:
      return {
        ...state,
        timeFilter: mapRangeNameToTimeFilter(action.value as TimeRange),
        showCustomRangePicker:
          (action.value as TimeRange) === TimeRange.CustomRange,
      };
    default:
      throw new Error('action ' + action + ' not supported');
  }
};
type AC = ReturnType<typeof createActionCreators>;
export {
  initialState as timeFilterInitialState,
  createActionCreators as createTimeFilterAC,
  reducer as timeFilterReducer,
};
export { State as TimeFilterState, AC as TimeFilterAC };
