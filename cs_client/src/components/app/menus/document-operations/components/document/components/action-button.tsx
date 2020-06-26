import React from 'react';
import { DS } from '::types/graphql/generated';
import { Icons, Icon } from '::shared-components/icon/icon';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { modDocumentOperations } from '::sass-modules/index';

const ActionButton = ({ eventType, deleteDocument, clear, open }) => {
  const status = {
    finished: eventType === DS.IMPORT_FINISHED,
    duplicate: eventType === DS.IMPORT_DUPLICATE,
    failed: eventType === DS.IMPORT_FAILED,
    onGoing: [
      DS.IMPORT_PENDING,
      DS.IMPORT_PREPARING,
      DS.IMPORT_STARTED,
    ].includes(eventType),
  };
  const props = { onClick: undefined, iconName: '' };
  if (status.onGoing || status.failed) {
    props.onClick = deleteDocument;
    props.iconName = status.onGoing
      ? Icons.material.stop
      : Icons.material.delete;
  } else if (status.finished) {
    props.iconName = Icons.material.document;
    props.onClick = open;
  } else if (status.duplicate) {
    props.iconName = Icons.material.clear;
    props.onClick = clear;
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
