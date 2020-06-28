import React from 'react';
import { Icons, Icon } from '::shared-components/icon/icon';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { modDocumentOperations } from '::sass-modules/index';
import { ac } from '::root/store/store';
import { OperationTypes } from '../helpers/operation-types';
import { uri } from '::graphql/apollo';

const ActionButton = ({ document, deleteDocument, open, userId }) => {
  const { id, status, hash, name } = document;
  const props = { onClick: undefined, iconName: '' };
  if (OperationTypes.import.active[status]) {
    props.iconName = Icons.material.stop;
    props.onClick = deleteDocument;
  } else if (OperationTypes.import.failed[status]) {
    props.iconName = Icons.material.delete;
    props.onClick = deleteDocument;
  } else if (OperationTypes.import.successful[status]) {
    props.iconName = Icons.material.document;
    props.onClick = open;
  } else if (OperationTypes.import.blocked[status]) {
    props.iconName = Icons.material.clear;
    props.onClick = ac.documentOperations.clearFinished;
  } else if (OperationTypes.export.successful[status]) {
    props.iconName = Icons.material.download;
    props.onClick = () =>
      window.open(`${uri.httpBase}/exports/${userId}/${id}/${hash}/${name}`);
  }
  if (OperationTypes.export.failed[status]) {
    props.iconName = Icons.material.clear;
    props.onClick = () => {
      ac.documentOperations.deleteExport(id);
    };
  }
  return !props.onClick ? (
    <></>
  ) : (
    <ButtonCircle
      key={props.iconName}
      className={modDocumentOperations.documentOperations__document__button}
      onClick={props.onClick}
    >
      <Icon {...{ name: props.iconName }} />
    </ButtonCircle>
  );
};

export { ActionButton };
