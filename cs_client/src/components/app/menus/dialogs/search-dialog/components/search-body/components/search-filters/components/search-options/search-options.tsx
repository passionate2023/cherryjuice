import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { useCallback } from 'react';
import { modSearchFilter } from '::sass-modules';
import { mapScopeToLabel } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';

const mapState = (state: Store) => ({
  searchOptions: state.search.searchOptions,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const SearchOptions: React.FC<Props & PropsFromRedux> = ({ searchOptions }) => {
  const setOptionM = useCallback(
    (optionName: string) => () => {
      ac.search.setSearchOptions({
        ...searchOptions,
        [optionName]: !searchOptions[optionName],
      });
    },
    [searchOptions],
  );

  return (
    <div className={modSearchFilter.searchFilter}>
      <span className={modSearchFilter.searchFilter__label}>
        search options
      </span>
      <div className={modSearchFilter.searchFilter__list}>
        {[{ optionName: 'caseSensitive' }, { optionName: 'fullWord' }].map(
          ({ optionName }) => (
            <div
              className={joinClassNames([
                modSearchFilter.searchFilter__list__item,
              ])}
              key={optionName}
            >
              <ButtonSquare
                text={mapScopeToLabel(optionName)}
                onClick={setOptionM(optionName)}
                active={searchOptions[optionName]}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
};
const _ = connector(SearchOptions);
export { _ as SearchOptions };
