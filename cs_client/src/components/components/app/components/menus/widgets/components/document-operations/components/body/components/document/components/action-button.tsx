import React from 'react';
import { Icons, Icon } from '::root/components/shared-components/icon/icon';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { modDocumentOperations } from '::sass-modules';
import { ac } from '::store/store';
import { OperationTypes } from '../helpers/operation-types';
import { uri } from '::graphql/client/hooks/apollo-client';
import { testIds } from '::cypress/support/helpers/test-ids';
import { DocumentOperation } from '::types/graphql/generated';
import { ProgressCircle } from '::root/components/shared-components/loading-indicator/progress-circle';

type Props = {
  operation: DocumentOperation;
  open: Function;
};
const ActionButton: React.FC<Props> = ({ operation, open }) => {
  const { id, hash, name } = operation.target;
  const { state, userId } = operation;
  const props = {
    onClick: undefined,
    iconName: '',
    testId: undefined,
    wrapper: function Wrapper({ children }): JSX.Element {
      return <>{children}</>;
    },
  };
  const deleteDocument = () => ac.documentsList.deleteDocument(id);
  if (OperationTypes.active[state]) {
    props.iconName = Icons.material.stop;
    if (typeof operation.progress === 'number') {
      props.onClick = () => undefined;
      props.wrapper = function Wrapper({ children }): JSX.Element {
        return (
          <ProgressCircle
            progress={operation.progress}
            size={13}
            className={modDocumentOperations.documentOperations__document__button}
          >
            {children}
          </ProgressCircle>
        );
      };
    } else {
      props.onClick = deleteDocument;
    }
  } else if (OperationTypes.failed[state]) {
    props.iconName = Icons.material.delete;
    props.onClick = deleteDocument;
  } else if (OperationTypes.successful[state]) {
    props.iconName = Icons.material.document;
    props.onClick = open;
    props.testId = `${testIds.popups__documentOperations__openDownloadedDocument}`;
  } else if (OperationTypes.blocked[state]) {
    props.iconName = Icons.material.clear;
    props.onClick = ac.documentOperations.removeFinished;
  } else if (OperationTypes.successful[state]) {
    props.iconName = Icons.material.download;
    props.testId = `${testIds.popups__documentOperations__downloadDocument}${id}`;
    props.wrapper = function Wrapper({ children }): JSX.Element {
      return (
        <a
          href={`${uri.httpBase}/exports/${userId}/${id}/${hash}/${name}`}
          target={'_blank'}
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    };
  }
  if (OperationTypes.failed[state]) {
    props.iconName = Icons.material.clear;
    props.onClick = () => {
      ac.documentOperations.remove(operation);
    };
  }
  return props.iconName ? (
    <ButtonCircle
      key={props.iconName}
      className={modDocumentOperations.documentOperations__document__button}
      onClick={props.onClick}
      testId={props.testId}
      icon={props.wrapper({ children: <Icon {...{ name: props.iconName }} /> })}
    />
  ) : (
    <></>
  );
};

export { ActionButton };
