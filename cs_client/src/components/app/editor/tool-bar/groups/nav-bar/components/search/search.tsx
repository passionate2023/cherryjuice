import * as React from 'react';
import { useCallback } from 'react';
import { modSearch } from '::sass-modules/';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { Icon, Icons } from '::shared-components/icon/icon';
import { joinClassNames } from '::helpers/dom/join-class-names';

const mapState = (state: Store) => ({
  query: state.search.query,
  searchType: state.search.searchType,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  className: string;
  navBar?: boolean;
};

const Search: React.FC<Props & PropsFromRedux> = ({
  className,
  query,
  navBar = true,
  searchType,
}) => {
  const setQueryM = useCallback(e => ac.search.setQuery(e.target.value), []);
  const clearLocalQueryM = useCallback(() => ac.search.clearQuery(), []);
  const onClick = ac.search.setSearchQueued;

  const searchImpossible = !query || searchType.length === 0;

  return (
    <div className={`${modSearch.search__container} ${className || ''}`}>
      <div
        className={`${modSearch.search__field} ${
          navBar ? modSearch.search__fieldNavBar : ''
        }`}
      >
        <input
          className={modSearch.search__field__input}
          type="text"
          placeholder={'search'}
          value={query}
          onChange={setQueryM}
        />
        <ButtonSquare
          className={joinClassNames([
            modSearch.search__searchButton,
            [modSearch.search__searchButtonNavBar, navBar],
            modSearch.search__field__clearTextButton,
            [modSearch.search__clearTextButtonVisible, query.length],
          ])}
          onClick={clearLocalQueryM}
          icon={<Icon name={Icons.material.clear} />}
        />
      </div>
      <ButtonSquare
        className={joinClassNames([
          modSearch.search__searchButton,
          [modSearch.search__searchButtonNavBar, navBar],
        ])}
        disabled={searchImpossible}
        onClick={onClick}
        icon={<Icon name={Icons.material.search} />}
      />
    </div>
  );
};

const _ = connector(Search);
export { _ as Search };
