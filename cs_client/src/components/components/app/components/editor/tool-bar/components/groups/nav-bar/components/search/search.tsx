import * as React from 'react';
import { modSearch } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { useRef } from 'react';
import { useOnKeyPress } from '::hooks/use-on-key-up';
import { SearchInput } from '::root/components/shared-components/inputs/search-input';

const mapState = (state: Store) => ({
  query: state.search.query,
  searchTarget: state.search.searchTarget,
  online: state.root.online,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  className?: string;
  navBar?: boolean;
};

const Search: React.FC<Props & PropsFromRedux> = ({
  className,
  query,
  navBar = true,
  searchTarget,
  online,
}) => {
  const searchImpossible = !navBar && (!query || searchTarget.length === 0);
  const ref = useRef<HTMLDivElement>();
  useOnKeyPress({
    ref,
    keys: ['Enter', 'Space'],
    onClick: ac.search.setSearchQueued,
  });
  return (
    <SearchInput
      containerClassName={className}
      fieldWrapperClassName={navBar ? modSearch.search__fieldNavBar : ''}
      inputRef={ref}
      placeHolder={'search'}
      value={query}
      onChange={ac.search.setQuery}
      searchButtonClassName={navBar ? modSearch.search__searchButtonNavBar : ''}
      onClear={ac.search.clearQuery}
      searchImpossible={searchImpossible}
      performSearch={ac.search.setSearchQueued}
      disabled={!online}
    />
  );
};

const _ = connector(Search);
export { _ as Search };
