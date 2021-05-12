import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { Icon } from '@cherryjuice/icons';
import { ButtonCircle } from '@cherryjuice/components';
import { ProgressCircle } from '::shared-components/loading-indicator/progress-circle';
import { DocumentOperation } from '@cherryjuice/graphql-types';
import { ac } from '::store/store';

type Props = { operation: DocumentOperation };
export const Active: React.FC<Props> = ({ operation }) => {
  return (
    <ButtonCircle
      className={modDocumentOperations.collapsableList__item__button}
      onClick={() => ac.documentsList.deleteDocument(operation.target.id)}
      icon={
        <ProgressCircle progress={operation.progress} size={13}>
          <Icon name={'stop'} />
        </ProgressCircle>
      }
    />
  );
};
