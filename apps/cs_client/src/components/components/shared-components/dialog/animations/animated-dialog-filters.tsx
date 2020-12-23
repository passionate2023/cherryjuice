import * as React from 'react';
import { ac } from '::store/store';
import { animated, useSpring } from 'react-spring';
import { configs } from '::root/components/shared-components/transitions/transitions';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchDialog } from '::sass-modules';
import { useSetCssVariablesOnWindowResize } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';

export const AnimatedDialogHeader: React.FC<{
  show: boolean;
  pinned: boolean;
}> = ({ show, pinned, children }) => {
  const ref = useSetCssVariablesOnWindowResize(
    ac.cssVariables.setSearchFiltersHeight,
    pinned,
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
      {children}
    </animated.div>
  );
};
