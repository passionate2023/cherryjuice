import * as React from 'react';
import { modDocumentOperations } from '../../../../../../../assets/styles/modules';
import { ButtonCircle } from '../../../../../shared-components/buttons/button-circle/button-circle';
import { ac } from '../../../../../../store/store';
import { EventHandler } from 'react';
import { OperationsStats } from '../header';

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
        >
          &times;
        </ButtonCircle>
      )}
      <ButtonCircle
        onClick={toggleCollapsed}
        className={modDocumentOperations.documentOperations__header__button}
      >
        {collapsed ? '▴' : '▾'}
      </ButtonCircle>
    </span>
  );
};

export { HeaderButtons };
