import * as React from 'react';
import { modSearchDialog } from '::sass-modules/';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { Result } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { configs } from '::shared-components/transitions/transitions';
import { useSpring, animated } from 'react-spring';
import { ResultsHeader } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/results-header';

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
  query,
  searchType,
  searchOptions,
}) => {
  dialogBodyHeight = dialogBodyHeight - 117; //- (isOnMobile ? 25 : 30);
  const bottomOffset = 10;
  let height =
    bottomOffset +
    (collapse ? dialogBodyHeight - searchFiltersHeight : dialogBodyHeight);
  if (collapse && height < 160) height = 0;
  const props = useSpring({
    to: {
      height,
    },
    config: configs.c1,
  });
  return (
    <>
      {!!searchResults?.results.length && query && (
        <animated.div
          className={joinClassNames([
            modSearchDialog.searchDialog__searchResults,
          ])}
          style={props}
          data-collapsed={height===0 ? true : undefined}
        >
          {<ResultsHeader searchResults={searchResults} />}
          <div
            className={joinClassNames([
              modSearchDialog.searchDialog__searchResults__list,
            ])}
          >
            {searchResults.results.map(result => (
              <Result
                key={result.nodeId}
                result={result}
                searchContext={{
                  query,
                  searchType,
                  searchOptions,
                }}
              />
            ))}
          </div>
        </animated.div>
      )}
      <div className={modSearchDialog.searchDialog__searchResults__footer} />
    </>
  );
};
const _ = connector(SearchResults);
export { _ as SearchResults };
