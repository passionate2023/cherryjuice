import * as React from 'react';
import { modSearchFilter } from '::sass-modules';
import { SearchType as TSearchType } from '@cherryjuice/graphql-types';
import { Store } from '::store/store';
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
  const searchTypes: TSearchType[] = [
    TSearchType.Simple,
    TSearchType.FullText,
    TSearchType.Regex,
  ];
  return (
    <div className={modSearchFilter.searchFilter}>
      <span className={modSearchFilter.searchFilter__label}>search method</span>
      <div className={modSearchFilter.searchFilter__list}>
        {searchTypes.map(optionName => (
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
