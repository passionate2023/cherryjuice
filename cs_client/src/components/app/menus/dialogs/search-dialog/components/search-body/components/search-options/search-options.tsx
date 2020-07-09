import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { useCallback } from 'react';
import { modSearchScope } from '::sass-modules/';
import { mapScopeToLabel } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-target/components/target';
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
    <div className={modSearchScope.searchScope}>
      <span
        className={modSearchScope.searchScope__scopeList__scope__scopeLabel}
      >
        search options
      </span>
      <div className={modSearchScope.searchScope__scopeList}>
        {[{ optionName: 'caseSensitive' }, { optionName: 'fullWord' }].map(
          ({ optionName }) => (
            <div
              className={joinClassNames([
                modSearchScope.searchScope__scopeList__scope,
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
