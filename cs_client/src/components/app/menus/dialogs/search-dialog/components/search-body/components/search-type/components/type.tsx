import { modSearchScope } from '::sass-modules/';
import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { mapScopeToLabel } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-target/components/target';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { SearchType } from '::types/graphql/generated';
import { useCallback } from 'react';
import { ac } from '::root/store/store';

type Props = {
  optionName: SearchType;
  searchType: SearchType;
};

const Type: React.FC<Props> = ({ optionName, searchType }) => {
  const setOptionM = useCallback(() => {
    ac.search.setSearchType(optionName);
  }, []);
  return (
    <div
      className={joinClassNames([modSearchScope.searchScope__scopeList__scope])}
      key={optionName}
    >
      <ButtonSquare
        text={mapScopeToLabel(optionName)}
        onClick={setOptionM}
        active={searchType === optionName}
      />
    </div>
  );
};

export { Type };
