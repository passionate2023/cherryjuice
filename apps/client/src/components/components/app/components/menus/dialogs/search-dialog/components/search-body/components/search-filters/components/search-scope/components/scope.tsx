import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchFilter } from '::sass-modules';
import { ButtonSquare } from '@cherryjuice/components';
import { SearchScope } from '@cherryjuice/graphql-types';
import { ac } from '::store/store';
import { useCallback } from 'react';
import { mapEnumToReadableText } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';

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
        text={mapEnumToReadableText(scope)}
        onClick={setSearchScopeM}
        active={selectedScope === scope}
        disabled={disabled}
      />
    </div>
  );
};

export { Scope };
export { ScopeProps };
