import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const MUTATION = gql`
  mutation($file: Upload!) {
    document {
      upload(file: $file)
    }
  }
`;

const UploadFile: React.FC<{}> = () => {
  // eslint-disable-next-line no-unused-vars
  const [mutate,{loading,called,error,data}] = useMutation(MUTATION);

  const onChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) mutate({ variables: { file } });
  };

  return <input type="file" required onChange={onChange} />;
};

export { UploadFile };
