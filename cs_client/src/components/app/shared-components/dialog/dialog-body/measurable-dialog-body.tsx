import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { ReactNode } from 'react';
import { useSetCssVariablesOnWindowResize } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';
import { ac } from '::root/store/store';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  dockedDialog: state.root.dockedDialog,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { dialogBodyElements: ReactNode };

const MeasurableDialogBody: React.FC<Props & PropsFromRedux> = ({
  dialogBodyElements,
  dockedDialog,
}) => {
  const ref = useSetCssVariablesOnWindowResize(
    ac.cssVariables.setDialogBodyHeight,
    dockedDialog,
  );
  return (
    <div className={`${modDialog.dialog__content}`} ref={ref}>
      {dialogBodyElements}
    </div>
  );
};
const _ = connector(MeasurableDialogBody);
export { _ as MeasurableDialogBody };
