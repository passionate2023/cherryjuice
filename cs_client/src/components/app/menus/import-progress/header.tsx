import * as React from 'react';
import { modImportProgress } from '::sass-modules/index';
import { CircleButton } from '::shared-components/buttons/circle-button';
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
    ({ status }) =>
      status === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DUPLICATE ||
      status === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED ||
      status === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED,
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
          <CircleButton
            onClick={clearFinishedDocuments}
            className={modImportProgress.importProgress__header__button}
          >
            &times;
          </CircleButton>
        )}
        <CircleButton
          onClick={toggleCollapsed}
          className={modImportProgress.importProgress__header__button}
        >
          {collapsed ? '▴' : '▾'}
        </CircleButton>
      </span>
    </div>
  );
};

export { Header };
