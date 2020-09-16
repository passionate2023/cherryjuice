import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { ac } from '::store/store';
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
      {!stats.active && (
        <ButtonCircle
          dark={true}
          onClick={ac.documentOperations.removeFinished}
          className={modDocumentOperations.documentOperations__header__button}
          testId={testIds.popups__documentOperations__clearAllFinished}
          icon={<span>&times;</span>}
        />
      )}
      <ButtonCircle
        dark={true}
        onClick={toggleCollapsed}
        className={modDocumentOperations.documentOperations__header__button}
        icon={<span>{collapsed ? '▴' : '▾'}</span>}
      />
    </span>
  );
};

export { HeaderButtons };
