import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { SearchType } from '::root/store/ducks/search';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { useCallback } from 'react';

const mapScopeToLabel = (scope: SearchType) => {
  return scope.replace('-', ' ');
};

const mapState = (state: Store) => ({
  searchType: state.search.searchType,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  type: SearchType;
};

const Type: React.FC<Props & PropsFromRedux> = ({ type, searchType }) => {
  const setSearchTypeM = useCallback(() => {
    ac.search.setSearchType(type);
  }, []);
  return (
    <div
      className={joinClassNames([modSearchScope.searchScope__scopeList__scope])}
    >
      <ButtonSquare
        text={mapScopeToLabel(type)}
        onClick={setSearchTypeM}
        active={searchType.includes(type)}
      />
    </div>
  );
};

const _ = connector(Type);
export { _ as Type };
