import * as React from 'react';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { useRef } from 'react';
import { modImportDocument } from '::sass-modules/index';
import { Icon, Icons } from '::shared-components/icon/icon';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { apolloCache } from '::graphql/cache/apollo-cache';

const UploadFile: React.FC<{}> = () => {
  const inputRef = useRef<HTMLInputElement>();

  const onChange = ({ target: { validity, files } }) => {
    if (validity.valid) {
      apolloCache.client.mutate({
        query: DOCUMENT_MUTATION.file,
        path: () => undefined,
        variables: { files },
      });
      setTimeout(() => {
        inputRef.current.value = '';
      }, 500);
    }
  };
  return (
    <>
      <ButtonSquare
        onClick={() => inputRef.current.click()}
        className={modImportDocument.importDocument__button}
      >
        <Icon
          {...{
            name: Icons.material.storage,
            className: modImportDocument.importDocument__button__icon,
          }}
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
