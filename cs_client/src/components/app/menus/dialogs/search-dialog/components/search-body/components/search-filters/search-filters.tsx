import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { SearchTarget } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/search-target';
import { SearchOptions } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-options/search-options';
import { SearchScope } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/search-scope';
import { SearchType } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-type/search-type';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { useRef } from 'react';
import { ac, Store } from '::root/store/store';
import { connect, ConnectedProps } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { configs } from '::shared-components/transitions/transitions';
import { TimeFilters } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/time-filters';
import { SortOptions } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-sort/sort-options';

export const useSetCssVariablesOnWindowResize = (
  actionCreator,
  dependency?: any,
) => {
  const ref = useRef<HTMLDivElement>();
  const height = useRef(0);
  useOnWindowResize(
    [
      () => {
        const clientHeight = ref.current.clientHeight;
        if (clientHeight !== height.current) {
          height.current = clientHeight;
          actionCreator(clientHeight);
        }
      },
    ],
    dependency,
  );
  return ref;
};

type Props = {
  show: boolean;
};

const mapState = (state: Store) => ({
  dockedDialog: state.root.dockedDialog,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const SearchFilters: React.FC<Props & PropsFromRedux> = ({
  show,
  dockedDialog,
}) => {
  const ref = useSetCssVariablesOnWindowResize(
    ac.cssVariables.setSearchFiltersHeight,
    dockedDialog,
  );
  const props = useSpring({
    to: {
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(50px)',
    },
    config: configs.c1,
  });
  return (
    <animated.div
      className={joinClassNames([modSearchDialog.searchDialog__searchFilters])}
      ref={ref}
      style={props}
    >
      <SortOptions />
      <SearchTarget />
      <SearchScope />
      <SearchType />
      <SearchOptions />
      <TimeFilters />
    </animated.div>
  );
};
const _ = connector(SearchFilters);
export { _ as SearchFilters };
