import * as React from 'react';
import { modSearchDialog } from '::sass-modules/';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { Result } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { configs } from '::shared-components/transitions/transitions';
import { useSpring, animated } from 'react-spring';

const mapState = (state: Store) => ({
  searchResults: state.search.searchResults,
  searchFiltersHeight: state.cssVariables.searchFiltersHeight,
  dialogBodyHeight: state.cssVariables.dialogBodyHeight,
  isOnMobile: state.root.isOnMobile,
  query: state.search.query,
  searchOptions: state.search.searchOptions,
  searchType: state.search.searchType,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { collapse: boolean };

const SearchResults: React.FC<Props & PropsFromRedux> = ({
  searchResults,
  collapse,
  searchFiltersHeight,
  dialogBodyHeight,
  isOnMobile,
  query,
  searchType,
  searchOptions,
}) => {
  const adjustedDialogBodyHeight =
    dialogBodyHeight - 117 - (isOnMobile ? 10 : 30);
  searchFiltersHeight = searchFiltersHeight - (isOnMobile ? 55 : 45);
  const bottomOffset = 10;
  const height =
    bottomOffset +
    (collapse
      ? adjustedDialogBodyHeight - searchFiltersHeight
      : adjustedDialogBodyHeight);

  const props = useSpring({
    to: {
      height,
    },
    config: configs.c1,
  });
  return (
    <>
      <animated.div
        className={joinClassNames([
          modSearchDialog.searchDialog__searchResults,
        ])}
        style={props}
      >
        {searchResults.map(result => (
          <Result
            key={result.nodeId}
            result={result}
            searchMeta={{ query, searchType, searchOptions }}
          />
        ))}
      </animated.div>
      <div className={modSearchDialog.searchDialog__searchResults__footer} />
    </>
  );
};
const _ = connector(SearchResults);
export { _ as SearchResults };
