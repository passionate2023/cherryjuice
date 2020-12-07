import { blobToBase64 } from '::root/components/editor/helpers/clipboard/helpers/images/blob-to-base64';
import { ac } from '::store/store';
import { AlertType } from '::types/react';
import { addNodeToDom } from '::root/components/editor/helpers/clipboard/helpers/steps/add-to-dom/add-node-to-dom';
import { processClipboard } from '::root/components/editor/helpers/clipboard/helpers/steps/process-clipboard-data/process-clipboard-data';

const handlePaste = async e => {
  if (
    e &&
    e.clipboardData &&
    e.clipboardData.types &&
    e.clipboardData.getData
  ) {
    e.preventDefault();
    e.stopPropagation();
    const { clipboardData } = e;
    if (clipboardData.types.includes('Files')) {
      const file = clipboardData.files[0];
      const base64 = await blobToBase64(file);
      addNodeToDom({ pastedData: processClipboard.image(base64) });
    } else if (clipboardData.types.includes('text/html')) {
      const pastedData = e.clipboardData.getData('text/html');
      addNodeToDom({ pastedData: processClipboard.html(pastedData) });
    } else if (clipboardData.types.includes('text/plain')) {
      const pastedData = e.clipboardData.getData('text/plain');
      addNodeToDom({ pastedData: processClipboard.text(pastedData) });
    }
  }
};
const onPaste = e => {
  handlePaste(e).catch(error => {
    ac.dialogs.setAlert({
      title: 'Could not perform the paste',
      description: 'Please submit a bug report',
      error,
      type: AlertType.Error,
    });
  });
};

export { onPaste };
