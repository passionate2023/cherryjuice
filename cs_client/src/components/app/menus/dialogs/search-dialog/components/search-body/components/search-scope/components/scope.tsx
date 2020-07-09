import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { SearchScope } from '::root/store/ducks/search';
import { ac } from '::root/store/store';
import { useCallback } from 'react';

const mapScopeToLabel = (scope: SearchScope) => {
  return scope.replace('-', ' ');
};

type ScopeProps = {
  scope: SearchScope;
  selectedScope: SearchScope;
  disabled: boolean;
};

const Scope: React.FC<ScopeProps> = ({ scope, selectedScope, disabled }) => {
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
        disabled={disabled}
      />
    </div>
  );
};

export { Scope };
export { ScopeProps };
