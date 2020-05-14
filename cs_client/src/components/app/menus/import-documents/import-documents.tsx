import { modImportDocument } from '::sass-modules/index';
import { UploadFile } from './dialog-buttons/upload-file';
import { GoogleDrivePicker } from './dialog-buttons/google-drive-picker/google-drive-picker';
import * as React from 'react';
import { EventHandler } from 'react';
import { ComponentWithTransition } from '::shared-components/transitions/component-with-transition';
import { transitions } from '::shared-components/transitions/transitions';

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
};

const ImportDocuments: React.FC<Props> = ({ onClose, show }) => {
  return (
    <ComponentWithTransition
      show={show}
      onClose={onClose}
      transitionValues={transitions.t1}
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

export default ImportDocuments;
