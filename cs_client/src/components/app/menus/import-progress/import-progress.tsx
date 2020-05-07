import { modImportProgress } from '::sass-modules/index';
import * as React from 'react';
import { useState } from 'react';
import { Header } from './header';
import { Document } from './document';
import {
  DOCUMENT_SUBSCRIPTIONS,
  DocumentSubscription,
} from '::types/graphql/generated';
import { useData } from '::app/menus/import-progress/hooks/use-data';

type Props = {};
type TActiveImports = {
  [id: string]: DocumentSubscription;
};
const mapDocuments = (activeImports: TActiveImports) =>
  Object.values(activeImports).map(document => ({
    key: document.documentId,
    name: document.documentName,
    id: document.documentId,
    eventType: document.eventType,
  }));

const ImportProgress: React.FC<Props> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const [activeImports, setActiveImports] = useState<TActiveImports>({});

  useData({ setActiveImports, activeImports });

  const clearFinishedDocuments = () => {
    const unfinishedImports = Object.fromEntries(
      Object.entries(activeImports).filter(
        ([, documentProps]) =>
          documentProps.eventType ===
            DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PENDING ||
          documentProps.eventType ===
            DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED ||
          documentProps.eventType ===
            DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING,
      ),
    );
    setActiveImports(unfinishedImports);
  };
  const documents = mapDocuments(activeImports);
  return documents.length ? (
    <div
      className={`${modImportProgress.importProgress} ${
        collapsed ? modImportProgress.importProgressCollapsed : ''
      }`}
    >
      <Header
        toggleCollapsed={toggleCollapsed}
        documents={documents}
        collapsed={collapsed}
        clearFinishedDocuments={clearFinishedDocuments}
      />
      <div className={modImportProgress.importProgress__header__buttons} />
      <div className={modImportProgress.importProgress__documents}>
        {documents.map(document => (
          <Document
            key={document.id}
            {...document}
            clearFinishedDocuments={clearFinishedDocuments}
          />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ImportProgress;
