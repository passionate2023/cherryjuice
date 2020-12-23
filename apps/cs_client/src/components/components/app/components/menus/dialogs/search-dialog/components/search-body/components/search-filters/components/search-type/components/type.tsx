import { modSearchFilter } from '::sass-modules';
import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { mapScopeToLabel } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';
import { ButtonSquare } from '@cherryjuice/components';
import { SearchType } from '@cherryjuice/graphql-types';
import { useCallback } from 'react';
import { ac } from '::store/store';

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
      className={joinClassNames([modSearchFilter.searchFilter__list__item])}
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
