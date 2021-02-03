import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { Search, SearchProps } from '::shared-components/search-input/search';

const mapState = (state: Store) => ({
  query: state.search.query,
  searchTarget: state.search.searchTarget,
  online: state.root.online,
  wd: state.root.isOnWd,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  navBar?: boolean;
  lazyAutoFocus?: boolean;
  style?: SearchProps['style'];
};

const DocumentSearch: React.FC<Props & PropsFromRedux> = ({
  query,
  navBar = true,
  searchTarget,
  online,
  lazyAutoFocus,
  wd,
  style,
}) => {
  const searchImpossible = !navBar && searchTarget.length === 0;

  return (
    <Search
      // containerClassName={className}
      // autoCollapse={navBar}
      placeholder={'search'}
      providedValue={query}
      onChange={ac.search.setQuery}
      // searchButtonClassName={navBar ? modToolbar.search__searchButton : ''}
      // onClear={ac.search.clearQuery}
      // searchImpossible={searchImpossible}
      performSearch={ac.search.setSearchQueued}
      disabled={!online || searchImpossible}
      lazyAutoFocus={lazyAutoFocus}
      hideableInput={'external'}
      hideInput={!wd && navBar}
      style={style}
    />
  );
};

const _ = connector(DocumentSearch);
export { _ as DocumentSearch };
