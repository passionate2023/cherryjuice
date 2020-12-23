import * as React from 'react';
import { modSearch } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { memo, useRef } from 'react';
import { useOnKeyPress } from '@cherryjuice/shared-helpers';
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
  lazyAutoFocus?: boolean;
};

const Search: React.FC<Props & PropsFromRedux> = ({
  className,
  query,
  navBar = true,
  searchTarget,
  online,
  lazyAutoFocus,
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
      autoCollapse={navBar}
      inputRef={ref}
      placeHolder={'search'}
      value={query}
      onChange={ac.search.setQuery}
      searchButtonClassName={navBar ? modSearch.search__searchButtonNavBar : ''}
      onClear={ac.search.clearQuery}
      searchImpossible={searchImpossible}
      performSearch={ac.search.setSearchQueued}
      disabled={!online}
      lazyAutoFocus={lazyAutoFocus}
    />
  );
};

const _ = connector(Search);
const M = memo(_);
export { M as Search };
