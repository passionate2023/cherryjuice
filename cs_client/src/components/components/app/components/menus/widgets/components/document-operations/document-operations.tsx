import { modDocumentOperations } from '::sass-modules';
import * as React from 'react';
import { DocumentOperation } from '::types/graphql';
import { OperationTypes } from '::root/components/app/components/menus/widgets/components/document-operations/components/helpers/operation-types';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { ac } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { CollapsableListItemProps } from '::root/components/app/components/menus/widgets/components/collapsable-list/components/body/components/collapsable-list-item';
import { ActionButton } from '::root/components/app/components/menus/widgets/components/document-operations/components/action-button';
import { mapEventType } from '::root/components/app/components/menus/widgets/components/document-operations/components/helpers/map-event-type';
import { CollapsableList } from '::root/components/app/components/menus/widgets/components/collapsable-list/collapsable-list';
import { Icons } from '::root/components/shared-components/icon/icon';

type OperationsStats = { inactive: number; active: number; total: number };
const getStats = (operations: DocumentOperation[]): OperationsStats => {
  const inactive = operations.filter(
    ({ state }) => !OperationTypes.active[state],
  ).length;
  const active = operations.length - inactive;

  return {
    inactive,
    active,
    total: operations.length,
  };
};

type Props = {
  operations: DocumentOperation[];
};

const DocumentOperations: React.FC<Props> = ({ operations }) => {
  const stats = getStats(operations);

  const listItems: CollapsableListItemProps[] = operations.map(operation => ({
    name: operation.target.name,
    description: mapEventType(operation),
    button: (
      <ActionButton
        open={() => {
          ac.document.setDocumentId(operation.target.id);
        }}
        operation={operation}
      />
    ),
  }));

  const headerButtons = !stats.active ? (
    <ButtonCircle
      dark={true}
      onClick={ac.documentOperations.removeFinished}
      className={modDocumentOperations.collapsableList__header__button}
      testId={testIds.popups__documentOperations__clearAllFinished}
      iconName={Icons.material.close}
    />
  ) : (
    <></>
  );
  const headerText = stats.active
    ? `processing ${stats.active} document${stats.active > 1 ? 's' : ''}`
    : 'no active operations';

  return (
    <CollapsableList
      text={headerText}
      items={listItems}
      additionalHeaderButtons={headerButtons}
    />
  );
};
const _ = React.memo(DocumentOperations);
export { _ as DocumentOperations };
