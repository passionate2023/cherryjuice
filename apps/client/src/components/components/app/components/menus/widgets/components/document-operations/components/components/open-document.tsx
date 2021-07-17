import * as React from 'react';
import { ButtonCircle } from '@cherryjuice/components';
import { modDocumentOperations } from '::sass-modules';
import { ac } from '::store/store';
import { testIds } from '@cherryjuice/test-ids';
import { DocumentOperation } from '@cherryjuice/graphql-types';
import { useEffect } from 'react';

type Props = { operation: DocumentOperation };
export const OpenDocument: React.FC<Props> = ({ operation }) => {
  useEffect(() => {
    ac.documentsList.fetchDocuments();
  }, []);
  return (
    <ButtonCircle
      className={modDocumentOperations.collapsableList__item__button}
      onClick={() => ac.document.setDocumentId(operation.target.id)}
      iconName={'document'}
      testId={testIds.popups__documentOperations__openDownloadedDocument}
    />
  );
};
