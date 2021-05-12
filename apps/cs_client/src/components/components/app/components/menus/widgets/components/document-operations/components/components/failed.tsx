import * as React from 'react';
import { DocumentOperation } from '@cherryjuice/graphql-types';
import { modDocumentOperations } from '::sass-modules';
import { ac } from '::store/store';
import { ButtonCircle } from '@cherryjuice/components';

type Props = { operation: DocumentOperation };
export const Failed: React.FC<Props> = ({ operation }) => {
  return (
    <ButtonCircle
      className={modDocumentOperations.collapsableList__item__button}
      onClick={() => ac.documentsList.deleteDocument(operation.target.id)}
      iconName={'delete'}
    />
  );
};
