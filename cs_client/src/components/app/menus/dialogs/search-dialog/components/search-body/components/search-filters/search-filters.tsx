import * as React from 'react';
import { modSearchDialog } from '::sass-modules/';
import { SearchTarget } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/search-target';
import { SearchOptions } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-options/search-options';
import { SearchScope } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-scope/search-scope';
import { SearchType } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-type/search-type';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { useRef } from 'react';
import { ac } from '::root/store/store';

export const useSetCssVariables = actionCreator => {
  const ref = useRef<HTMLDivElement>();
  const height = useRef(0);
  useOnWindowResize([
    () => {
      const clientHeight = ref.current.clientHeight;
      if (clientHeight !== height.current) {
        height.current = clientHeight;
        actionCreator(clientHeight);
      }
    },
  ]);
  return ref;
};

type Props = {
  show: boolean;
};

const SearchFilters: React.FC<Props> = () => {
  const ref = useSetCssVariables(ac.cssVariables.setSearchFiltersHeight);
  return (
    <div
      className={joinClassNames([modSearchDialog.searchDialog__searchFilters])}
      ref={ref}
    >
      <SearchTarget />
      <SearchScope />
      <SearchType />
      <SearchOptions />
    </div>
  );
};

export { SearchFilters };
