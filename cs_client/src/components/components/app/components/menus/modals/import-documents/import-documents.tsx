import { modAlertModal, modImportDocument } from '::sass-modules';
import { UploadFile } from './dialog-buttons/upload-file';
import { GoogleDrivePicker } from './dialog-buttons/google-drive-picker/google-drive-picker';
import * as React from 'react';
import { ComponentWithTransition } from '::root/components/shared-components/transitions/component-with-transition';
import { transitions } from '::root/components/shared-components/transitions/transitions';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';

const mapState = (state: Store) => ({
  show: state.dialogs.showImportDocuments,
  secrets: state.auth.secrets,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ImportDocuments: React.FC<Props & PropsFromRedux> = ({
  show,
  secrets,
}) => {
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
        <GoogleDrivePicker secrets={secrets} />
      </div>
    </ComponentWithTransition>
  );
};
const _ = connector(ImportDocuments);
export default _;
