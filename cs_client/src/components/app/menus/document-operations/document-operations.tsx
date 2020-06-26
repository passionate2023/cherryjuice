import { modDocumentOperations } from '::sass-modules/index';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Header } from './components/header';
import { Document } from './components/document/document';
import { DocumentSubscription } from '::types/graphql/generated';
import { mapDocuments } from './helpers/map-documents';
import { clearUnfinishedImports } from './helpers/clear-funfinished-imports';
import { useGetActiveOperations } from './hooks/get-active-operations';
import { useGetPreviousOperations } from './hooks/get-previous-operations';

type Props = {};
type ActiveOperations = {
  [id: string]: DocumentSubscription;
};

const DocumentOperations: React.FC<Props> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const [activeOperations, setActiveOperations] = useState<ActiveOperations>(
    {},
  );

  useGetPreviousOperations({
    setActiveImports: setActiveOperations,
    activeImports: activeOperations,
  });
  useGetActiveOperations({
    setActiveImports: setActiveOperations,
    activeImports: activeOperations,
  });

  const documents = useMemo(() => mapDocuments(activeOperations), [
    activeOperations,
  ]);
  const clearUnfinished = useCallback(
    clearUnfinishedImports(setActiveOperations)(activeOperations),
    [setActiveOperations, activeOperations],
  );
  return documents.length ? (
    <div
      className={`${modDocumentOperations.documentOperations} ${
        collapsed ? modDocumentOperations.documentOperationsCollapsed : ''
      }`}
    >
      <Header
        toggleCollapsed={toggleCollapsed}
        documents={documents}
        collapsed={collapsed}
        clearFinishedDocuments={clearUnfinished}
      />
      <div
        className={modDocumentOperations.documentOperations__header__buttons}
      />
      <div
        className={modDocumentOperations.documentOperations__documentsContainer}
      >
        {documents.map(document => (
          <Document
            key={document.id}
            {...document}
            clearFinishedDocuments={clearUnfinished}
          />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default DocumentOperations;
export { ActiveOperations };
