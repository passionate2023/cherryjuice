import * as React from 'react';
import { modDocumentOperations } from '../../../../../../../assets/styles/modules';
import { ButtonCircle } from '../../../../../shared-components/buttons/button-circle/button-circle';
import { ac } from '../../../../../../store/store';
import { EventHandler } from 'react';
import { OperationsStats } from '../header';
import { testIds } from '::cypress/support/helpers/test-ids';

type Props = {
  collapsed: boolean;
  toggleCollapsed: EventHandler<any>;
  stats: OperationsStats;
};

const HeaderButtons: React.FC<Props> = ({
  toggleCollapsed,
  collapsed,
  stats,
}) => {
  return (
    <span className={modDocumentOperations.documentOperations__header__buttons}>
      {!stats.active && !collapsed && (
        <ButtonCircle
          onClick={ac.documentOperations.clearFinished}
          className={modDocumentOperations.documentOperations__header__button}
          testId={testIds.popups__documentOperations__clearAllFinished}
          icon={<span>&times;</span>}
        />
      )}
      <ButtonCircle
        onClick={toggleCollapsed}
        className={modDocumentOperations.documentOperations__header__button}
        icon={<span>{collapsed ? '▴' : '▾'}</span>}
      />
    </span>
  );
};

export { HeaderButtons };
