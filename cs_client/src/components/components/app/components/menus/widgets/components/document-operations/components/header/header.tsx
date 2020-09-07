import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { EventHandler } from 'react';
import { DocumentSubscription } from '::types/graphql/generated';
import { HeaderButtons } from './components/header-buttons';
import { HeaderText } from './components/header-text';
import { OperationTypes } from '../body/components/document/helpers/operation-types';

type OperationsStats = { inactive: number; active: number; total: number };
const getStats = (
  imports: DocumentSubscription[],
  exports: DocumentSubscription[],
): OperationsStats => {
  const documents = [...imports, ...exports];
  const inactive = documents.filter(
    ({ status }) =>
      !OperationTypes.import.active[status] &&
      !OperationTypes.export.active[status],
  ).length;
  const active = documents.length - inactive;

  return {
    inactive,
    active,
    total: documents.length,
  };
};

type Props = {
  toggleCollapsed: EventHandler<any>;
  imports: DocumentSubscription[];
  exports: DocumentSubscription[];
  collapsed: boolean;
};
const Header: React.FC<Props> = ({ collapsed,toggleCollapsed, imports, exports }) => {
  const stats = getStats(imports, exports);
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
