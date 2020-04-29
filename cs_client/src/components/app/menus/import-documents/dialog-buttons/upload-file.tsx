import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { useRef } from 'react';
import { modImportDocument } from '::sass-modules/index';
import { Icon, Icons } from '::shared-components/icon';
import { DOCUMENT_MUTATION } from '::graphql/mutations';

const UploadFile: React.FC<{}> = () => {
  // eslint-disable-next-line no-unused-vars
  const [mutate, { loading, called, error, data }] = useMutation(
    DOCUMENT_MUTATION.file,
  );

  const onChange = ({ target: { validity, files } }) => {
    if (validity.valid) mutate({ variables: { files } });
  };
  const inputRef = useRef<HTMLInputElement>();
  return (
    <>
      <ButtonSquare
        onClick={() => inputRef.current.click()}
        className={modImportDocument.importDocument__button}
      >
        <Icon
          name={Icons.material.storage}
          small={true}
          className={modImportDocument.importDocument__button__icon}
        />
        local storage
      </ButtonSquare>
      <input
        type="file"
        required
        multiple
        onChange={onChange}
        style={{ visibility: 'hidden', width: 0, height: 0 }}
        ref={inputRef}
      />
    </>
  );
};

export { UploadFile };
