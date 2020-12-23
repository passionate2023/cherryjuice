import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { configs } from '::root/components/shared-components/transitions/transitions';
import { animated, useSpring } from 'react-spring';

const mapState = (state: Store) => ({
  searchFiltersHeight: state.cssVariables.searchFiltersHeight,
  dialogBodyHeight: state.cssVariables.dialogBodyHeight,
  isOnMobile: state.root.isOnMd,
});

export const adjustDialogBodyHeight = (
  dialogBodyHeight,
  collapse,
  filtersHeight,
): number => {
  dialogBodyHeight = dialogBodyHeight - 117; //- (isOnMobile ? 25 : 30);
  const bottomOffset = 10;
  let height =
    bottomOffset +
    (collapse ? dialogBodyHeight - filtersHeight : dialogBodyHeight);
  if (collapse && height < 160) height = 0;
  return height;
};

const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { collapse: boolean; offset?: number };

const CollapsableDialogBody: React.FC<Props & PropsFromRedux> = ({
  collapse,
  searchFiltersHeight,
  dialogBodyHeight,
  children,
  offset = 0,
}) => {
  let height = adjustDialogBodyHeight(
    dialogBodyHeight,
    collapse,
    searchFiltersHeight,
  );
  if (height > 0) height += offset;
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
          modSearchDialog.searchDialog__collapsableSearchResults,
        ])}
        style={props}
        data-collapsed={height === 0 ? true : undefined}
      >
        {children}
      </animated.div>
      <div
        className={
          modSearchDialog.searchDialog__collapsableSearchResults__footer
        }
      />
    </>
  );
};

const _ = connector(CollapsableDialogBody);
export { _ as CollapsableDialogBody };
