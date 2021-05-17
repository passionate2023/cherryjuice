import * as React from 'react';
import { ButtonCircle } from '@cherryjuice/components';
import { modDocumentOperations } from '::sass-modules';
import { ac } from '::store/store';

export const ClearDocumentOperation: React.FC = () => {
  return (
    <ButtonCircle
      className={modDocumentOperations.collapsableList__item__button}
      onClick={ac.documentOperations.removeFinished}
      iconName={'clear'}
    />
  );
};
