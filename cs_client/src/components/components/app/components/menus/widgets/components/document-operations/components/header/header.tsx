import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { EventHandler } from 'react';
import { DocumentOperation } from '::types/graphql/generated';
import { HeaderButtons } from './components/header-buttons';
import { HeaderText } from './components/header-text';
import { OperationTypes } from '../body/components/document/helpers/operation-types';

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
  toggleCollapsed: EventHandler<any>;
  operations: DocumentOperation[];
  collapsed: boolean;
};
const Header: React.FC<Props> = ({
  collapsed,
  toggleCollapsed,
  operations,
}) => {
  const stats = getStats(operations);
  return (
    <div className={modDocumentOperations.documentOperations__header}>
      <HeaderText collapsed={false} stats={stats} />
      <HeaderButtons
        toggleCollapsed={toggleCollapsed}
        collapsed={collapsed}
        stats={stats}
      />
    </div>
  );
};

export { Header };
export { OperationsStats };
