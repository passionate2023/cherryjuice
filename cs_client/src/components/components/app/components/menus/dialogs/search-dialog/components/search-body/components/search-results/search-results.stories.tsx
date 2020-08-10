import React, { useEffect } from 'react';
import { searchResultsData } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/__tests__/__data__/samples';
import { SearchResults } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/search-results';
import { ac } from '::store/store';

export default { title: 'search/results/search-results' };

const Wrapper: React.FC<{ effect: Function }> = ({ effect, children }) => {
  useEffect(() => {
    effect();
  }, []);
  return <div>{children}</div>;
};

export const withText = () => {
  return (
    <Wrapper
      effect={() => {
        ac.search.setSearchFulfilled(searchResultsData.sample1.search.node);
      }}
    >
      <SearchResults collapse={false} />
    </Wrapper>
  );
};
