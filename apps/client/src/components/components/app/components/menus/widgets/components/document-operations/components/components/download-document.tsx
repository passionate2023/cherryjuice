import * as React from 'react';
import { ButtonCircle } from '@cherryjuice/components';
import { modDocumentOperations } from '::sass-modules';
import { ac } from '::store/store';
import { testIds } from '@cherryjuice/test-ids';
import { DocumentOperation } from '@cherryjuice/graphql-types';
import { Icon } from '@cherryjuice/icons';
import { uri } from '::graphql/client/hooks/apollo-client';

type Props = { operation: DocumentOperation };
export const DownloadDocument: React.FC<Props> = ({ operation }) => {
  const { id, hash, name } = operation.target;
  const { userId } = operation;
  return (
    <ButtonCircle
      className={modDocumentOperations.collapsableList__item__button}
      onClick={() => ac.document.setDocumentId(operation.target.id)}
      icon={
        <a
          href={`${uri.httpBase}/exports/${userId}/${id}/${hash}/${name}`}
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <Icon name={'download'} />
        </a>
      }
      testId={`${testIds.popups__documentOperations__downloadDocument}${id}`}
    />
  );
};
