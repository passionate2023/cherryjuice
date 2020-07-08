import React from 'react';
import { Icons, Icon } from '::shared-components/icon/icon';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { modDocumentOperations } from '::sass-modules/index';
import { ac } from '::root/store/store';
import { OperationTypes } from '../helpers/operation-types';
import { uri } from '::graphql/apollo';
import { testIds } from '::cypress/support/helpers/test-ids';

const ActionButton = ({ document, deleteDocument, open, userId }) => {
  const { id, status, hash, name } = document;
  const props = {
    onClick: undefined,
    iconName: '',
    testId: undefined,
    wrapper: function Wrapper({ children }): JSX.Element {
      return <>{children}</>;
    },
  };
  if (OperationTypes.import.active[status]) {
    props.iconName = Icons.material.stop;
    props.onClick = deleteDocument;
  } else if (OperationTypes.import.failed[status]) {
    props.iconName = Icons.material.delete;
    props.onClick = deleteDocument;
  } else if (OperationTypes.import.successful[status]) {
    props.iconName = Icons.material.document;
    props.onClick = open;
    props.testId = `${testIds.popups__documentOperations__openDownloadedDocument}`;
  } else if (OperationTypes.import.blocked[status]) {
    props.iconName = Icons.material.clear;
    props.onClick = ac.documentOperations.clearFinished;
  } else if (OperationTypes.export.successful[status]) {
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
  if (OperationTypes.export.failed[status]) {
    props.iconName = Icons.material.clear;
    props.onClick = () => {
      ac.documentOperations.deleteExport(id);
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
