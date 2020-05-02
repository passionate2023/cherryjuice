import { modImportDocument } from '::sass-modules/index';
import { UploadFile } from './dialog-buttons/upload-file';
import { GoogleDrivePicker } from './dialog-buttons/google-drive-picker/google-drive-picker';
import * as React from 'react';
import { EventHandler } from 'react';
import { ModalWithTransition } from '::shared-components/modal/modal';

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
};

const ImportDocuments: React.FC<Props> = ({ onClose, show }) => {
  return (
    <ModalWithTransition show={show} onClose={onClose}>
      <div className={modImportDocument.importDocument}>
        <span className={modImportDocument.importDocument__title}>
          Import from
        </span>
        <UploadFile />
        <GoogleDrivePicker />
      </div>
    </ModalWithTransition>
  );
};

export default ImportDocuments;
