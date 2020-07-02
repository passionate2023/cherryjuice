import { modAlertModal, modImportDocument } from '::sass-modules/index';
import { UploadFile } from './dialog-buttons/upload-file';
import { GoogleDrivePicker } from './dialog-buttons/google-drive-picker/google-drive-picker';
import * as React from 'react';
import { ComponentWithTransition } from '::shared-components/transitions/component-with-transition';
import { transitions } from '::shared-components/transitions/transitions';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';

const mapState = (state: Store) => ({
  show: state.dialogs.showImportDocuments,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ImportDocuments: React.FC<Props & PropsFromRedux> = ({ show }) => {
  return (
    <ComponentWithTransition
      show={show}
      onClose={ac.dialogs.hideImportDocument}
      transitionValues={transitions.t1}
      className={modAlertModal.alertModal}
    >
      <div className={modImportDocument.importDocument}>
        <span className={modImportDocument.importDocument__title}>
          Import from
        </span>
        <UploadFile />
        <GoogleDrivePicker />
      </div>
    </ComponentWithTransition>
  );
};
const _ = connector(ImportDocuments);
export default _;
