import * as React from 'react';
import { modImportProgress } from '::sass-modules/index';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { EventHandler } from 'react';
import { DOCUMENT_SUBSCRIPTIONS } from '::types/graphql/generated';
import { TDocumentProps } from '::app/menus/import-progress/document';

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
      eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DUPLICATE ||
      eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED ||
      eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED,
  ).length;
  const ongoingImports = documents.length - inactiveImports;
  const header = collapsed
    ? `(${inactiveImports}/${documents.length})`
    : ongoingImports
    ? `Importing ${ongoingImports} document${ongoingImports > 1 ? 's' : ''}`
    : 'finished importing';
  return (
    <div className={modImportProgress.importProgress__header}>
      <span className={modImportProgress.importProgress__header__text}>
        {header}
      </span>
      <span className={modImportProgress.importProgress__header__buttons}>
        {!ongoingImports && !collapsed && (
          <ButtonCircle
            onClick={clearFinishedDocuments}
            className={modImportProgress.importProgress__header__button}
          >
            &times;
          </ButtonCircle>
        )}
        <ButtonCircle
          onClick={toggleCollapsed}
          className={modImportProgress.importProgress__header__button}
        >
          {collapsed ? '▴' : '▾'}
        </ButtonCircle>
      </span>
    </div>
  );
};

export { Header };
