import * as React from 'react';
import { modDocumentOperations } from '::sass-modules/index';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { EventHandler } from 'react';
import { DS } from '::types/graphql/generated';
import { TDocumentProps } from './document/document';

type Props = {
  toggleCollapsed: EventHandler<any>;
  clearFinishedDocuments: EventHandler<any>;
  documents: TDocumentProps[];
  collapsed: boolean;
};
const Header: React.FC<Props> = ({
  toggleCollapsed,
  documents,
  collapsed,
  clearFinishedDocuments,
}) => {
  const inactiveImports = documents.filter(
    ({ eventType }) =>
      eventType === DS.IMPORT_DUPLICATE ||
      eventType === DS.IMPORT_FINISHED ||
      eventType === DS.IMPORT_FAILED,
  ).length;
  const ongoingImports = documents.length - inactiveImports;
  const header = collapsed
    ? `(${inactiveImports}/${documents.length})`
    : ongoingImports
    ? `Importing ${ongoingImports} document${ongoingImports > 1 ? 's' : ''}`
    : 'finished importing';
  return (
    <div className={modDocumentOperations.documentOperations__header}>
      <span className={modDocumentOperations.documentOperations__header__text}>
        {header}
      </span>
      <span className={modDocumentOperations.documentOperations__header__buttons}>
        {!ongoingImports && !collapsed && (
          <ButtonCircle
            onClick={clearFinishedDocuments}
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
    </div>
  );
};

export { Header };
