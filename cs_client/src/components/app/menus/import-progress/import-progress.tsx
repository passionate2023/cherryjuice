import { modImportProgress } from '::sass-modules/index';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Header } from './header';
import { Document } from './document';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { SUBSCRIPTION_DOCUMENT } from '::graphql/subscriptions';
import {
  DOCUMENT_SUBSCRIPTIONS,
  DocumentSubscription,
} from '::types/graphql/generated';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { RootContext } from '::root/root-context';

type Props = {};

const ImportProgress: React.FC<Props> = () => {
  const { session } = useContext(RootContext);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const [activeImports, setActiveImports] = useState<{
    [id: string]: DocumentSubscription;
  }>({});

  const { data: queryData } = useQuery(QUERY_DOCUMENTS.currentImports.query);
  QUERY_DOCUMENTS.currentImports
    .path(queryData)
    .filter(({ status }) => status)
    .forEach(({ id, status, name }) => {
      activeImports[id] = {
        documentId: id,
        documentName: name,
        eventType: status,
      };
    });

  const { data: subscriptionData } = useSubscription(
    SUBSCRIPTION_DOCUMENT.query,
    {
      variables: { userId: session.user.id },
    },
  );
  const document = SUBSCRIPTION_DOCUMENT.path(subscriptionData);
  useEffect(() => {
    if (document)
      setActiveImports({
        ...activeImports,
        [document.documentId]: document,
      });
  }, [document]);

  const clearFinishedDocuments = () => {
    const unfinishedImports = Object.entries(activeImports).filter(
      ([, { eventType }]) =>
        eventType !== DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED &&
        eventType !== DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED,
    );
    setActiveImports(Object.fromEntries(unfinishedImports));
  };
  const documents = Object.values(activeImports).map(document => ({
    key: document.documentId,
    name: document.documentName,
    id: document.documentId,
    status: document.eventType,
  }));
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
          <Document key={document.id} {...document} />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ImportProgress;
