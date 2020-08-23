/* eslint-disable no-console */
import React, { useRef } from 'react';
import { Filter } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/time-filter';
import { TimeRange } from '::types/graphql/generated';
import { appModule } from '::sass-modules';

const AppWrapper: React.FC = ({ children }) => {
  const mounted = useRef(false);
  if (!mounted.current) {
    const element = document.createElement('div');
    element.classList.add(appModule.app);
    document.body.appendChild(element);
    mounted.current = true;
  }
  return <>{children}</>;
};

const config = {
  title: 'search/filters/time-filter',
};
export const withText = () => (
  <AppWrapper>
    <Filter
      filterName={'created between'}
      onChange={console.info}
      timeFilter={{ rangeName: TimeRange.AnyTime, rangeStart: 0, rangeEnd: 0 }}
    />
  </AppWrapper>
);

export default config;
