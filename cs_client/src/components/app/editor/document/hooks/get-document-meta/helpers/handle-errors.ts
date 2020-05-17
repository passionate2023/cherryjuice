import { appActionCreators } from '::app/reducer';

const handleErrors = ({ file_id, selectedFile, history, error }) => {
  if (error) {
    if (file_id && file_id === selectedFile) {
      appActionCreators.selectFile(undefined);
      history.push('/');
    } else {
      history.push('/' + selectedFile);
    }
  } else {
    if (selectedFile && !file_id) history.push('/' + selectedFile);
    else if (file_id !== selectedFile && !/(login.*|signup.*)/.test(file_id)) {
      appActionCreators.selectFile(file_id);
    }
  }
};

export { handleErrors };
