import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter } from '::sass-modules';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { SearchScope } from '::types/graphql/generated';
import { ac } from '::store/store';
import { useCallback } from 'react';
import { mapScopeToLabel } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';

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
    <div className={joinClassNames([modSearchFilter.searchFilter__list__item])}>
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
