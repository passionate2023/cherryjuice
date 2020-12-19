import * as React from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { useRef } from 'react';
import { modImportDocument } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { apolloClient } from '::graphql/client/apollo-client';
import { testIds } from '::cypress/support/helpers/test-ids';

const UploadFile: React.FC<{}> = () => {
  const inputRef = useRef<HTMLInputElement>();

  const onChange = ({ target: { validity, files } }) => {
    if (validity.valid) {
      apolloClient.mutate({
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
        text={'local storage'}
        icon={
          <Icon
            {...{
              name: Icons.material.storage,
              className: modImportDocument.importDocument__button__icon,
            }}
          />
        }
      />
      <input
        data-testid={testIds.dialogs__importDocument__fileInput}
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
