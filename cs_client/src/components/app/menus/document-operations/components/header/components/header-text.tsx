import * as React from 'react';
import { modDocumentOperations } from '::sass-modules/';
import { OperationsStats } from '../header';

type Props = {
  stats: OperationsStats;
  collapsed: boolean;
};

const HeaderText: React.FC<Props> = ({ stats, collapsed }) => {
  const header = collapsed
    ? `(${stats.inactive}/${stats.total})`
    : stats.active
    ? `processing ${stats.active} document${stats.active > 1 ? 's' : ''}`
    : 'no active operations';
  return (
    <span className={modDocumentOperations.documentOperations__header__text}>
      {header}
    </span>
  );
};

export { HeaderText };
