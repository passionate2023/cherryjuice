import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { Search } from '::shared-components/search-input/search';
import { modTreeToolBar } from '::sass-modules';
import { useEffect } from 'react';

const mapState = (state: Store) => ({
  filter: state.document.nodesFilter,
  tb: state.root.isOnTb,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const FilterNodes: React.FC<Props & PropsFromRedux> = ({ filter, tb }) => {
  useEffect(() => {
    const parent = document.querySelector('.' + modTreeToolBar.treeToolBar);
    if (filter) {
      parent.classList.add(modTreeToolBar.treeToolBarActive);
    } else parent.classList.remove(modTreeToolBar.treeToolBarActive);
  }, [filter]);
  return (
    <Search
      providedValue={filter}
      onChange={ac.document.setNodesFilter}
      placeholder={'filter nodes'}
      hideableInput={'never'}
      style={{ height: tb ? 36 : 30 }}
      // containerClassName={modTreeToolBar.tree__searchFieldContainer}
      // fieldWrapperClassName={modTreeToolBar.tree__searchFieldWrapper}
      // searchButtonClassName={modTreeToolBar.tree__searchButton}
    />
  );
};

const _ = connector(FilterNodes);
export { _ as FilterNodes };
