import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { SearchInput } from '::root/components/shared-components/inputs/search-input';
import { modTreeToolBar } from '::sass-modules';

const mapState = (state: Store) => ({
  filter: state.document.nodesFilter,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const FilterNodes: React.FC<Props & PropsFromRedux> = ({ filter }) => {
  return (
    <SearchInput
      value={filter}
      onChange={ac.document.setNodesFilter}
      onClear={ac.document.clearNodesFilter}
      placeHolder={'search'}
      searchImpossible={false}
      containerClassName={modTreeToolBar.tree__searchFieldContainer}
      fieldWrapperClassName={modTreeToolBar.tree__searchFieldWrapper}
      searchButtonClassName={modTreeToolBar.tree__searchButton}
    />
  );
};

const _ = connector(FilterNodes);
export { _ as FilterNodes };
