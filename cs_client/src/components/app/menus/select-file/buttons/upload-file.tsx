import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const MUTATION = gql`
  mutation($file: Upload!) {
    uploadFile(file: $file) {
      success
    }
  }
`;

const UploadFile: React.FC<{}> = () => {
  const [mutate] = useMutation(MUTATION);

  function onChange({
    target: {
      validity,
      files: [file],
    },
  }) {
    if (validity.valid) mutate({ variables: { file } });
  }

  return <input type="file" required onChange={onChange} />;
};

export { UploadFile };
