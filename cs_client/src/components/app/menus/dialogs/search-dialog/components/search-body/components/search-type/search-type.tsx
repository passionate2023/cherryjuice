import * as React from 'react';
import { modSearchScope } from '::sass-modules/';
import { SearchType as TSearchType } from '::types/graphql/generated';
import { Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { Type } from './components/type';

const mapState = (state: Store) => ({
  searchType: state.search.searchType,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchType: React.FC<Props & PropsFromRedux> = ({ searchType }) => {
  return (
    <div className={modSearchScope.searchScope}>
      <span
        className={modSearchScope.searchScope__scopeList__scope__scopeLabel}
      >
        search method
      </span>
      <div className={modSearchScope.searchScope__scopeList}>
        {Object.values(TSearchType).map(optionName => (
          <Type
            key={optionName}
            optionName={optionName}
            searchType={searchType}
          />
        ))}
      </div>
    </div>
  );
};
const _ = connector(SearchType);
export { _ as SearchType };
