import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { Result } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/result';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { configs } from '::root/components/shared-components/transitions/transitions';
import { animated, useSpring } from 'react-spring';
import { ResultsHeader } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/results-header';
import { Animations } from '::store/ducks/animations';

const mapState = (state: Store) => ({
  searchResults: state.search.searchResults,
  searchFiltersHeight: state.cssVariables.searchFiltersHeight,
  dialogBodyHeight: state.cssVariables.dialogBodyHeight,
  isOnMobile: state.root.isOnMd,
  query: state.search.query,
  searchOptions: state.search.searchOptions,
  searchType: state.search.searchType,
  searchTarget: state.search.searchTarget,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { collapse: boolean };

export const createAnimationNotifiers = (animationName: Animations, show) => ({
  onStart: () => {
    ac.animation.onStart(animationName, show);
  },
  onRest: () => {
    ac.animation.onRest(animationName, show);
  },
});

const SearchResults: React.FC<Props & PropsFromRedux> = ({
  searchResults,
  collapse,
  searchFiltersHeight,
  searchTarget,
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
          data-collapsed={height === 0 ? true : undefined}
        >
          {<ResultsHeader searchResults={searchResults} />}
          <div
            className={joinClassNames([
              modSearchDialog.searchDialog__searchResults__list,
            ])}
          >
            {searchResults.results.map(result => (
              <Result
                key={result.nodeId + searchResults.meta.timestamp}
                result={result}
                searchContext={{
                  query,
                  searchType,
                  searchOptions,
                  searchTarget,
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
