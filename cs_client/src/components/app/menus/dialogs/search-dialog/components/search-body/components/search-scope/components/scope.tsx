import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { SearchScope } from '::root/store/ducks/search';
import { connect, ConnectedProps } from 'react-redux';
import { Store, ac } from '::root/store/store';
import { useCallback } from 'react';

const mapScopeToLabel = (scope: SearchScope) => {
  return scope.replace('-', ' ');
};

const mapState = (state: Store) => ({
  selectedScope: state.search.searchScope,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  scope: SearchScope;
};

const Scope: React.FC<Props & PropsFromRedux> = ({ scope, selectedScope }) => {
  const setSearchScopeM = useCallback(() => {
    ac.search.setSearchScope(scope);
  }, []);
  return (
    <div
      className={joinClassNames([modSearchScope.searchScope__scopeList__scope])}
    >
      <ButtonSquare
        text={mapScopeToLabel(scope)}
        onClick={setSearchScopeM}
        active={selectedScope === scope}
      />
    </div>
  );
};
const _ = connector(Scope);
export { _ as Scope };
