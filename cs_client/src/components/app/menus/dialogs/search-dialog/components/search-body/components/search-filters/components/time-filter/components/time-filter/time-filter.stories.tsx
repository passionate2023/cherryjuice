/* eslint-disable no-console */
import React from 'react';
import { Filter } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/time-filter';
import { TimeRange } from '::types/graphql/generated';

const config = {
  title: 'search/filters/time-filter',
};
export const withText = () => (
  <Filter
    filterName={'created between'}
    onChange={console.info}
    timeFilter={{ rangeName: TimeRange.AnyTime, rangeStart: 0, rangeEnd: 0 }}
  />
);

export default config;
