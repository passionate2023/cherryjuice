import { useContext, useEffect } from 'react';
import { RootContext } from '::root/root-context';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { SUBSCRIPTION_DOCUMENT } from '::graphql/subscriptions';

const useData = ({ activeImports, setActiveImports }) => {
  const { session } = useContext(RootContext);
  const { data: queryData } = useQuery(QUERY_DOCUMENTS.currentImports.query);
  useEffect(() => {
    const currentImports = QUERY_DOCUMENTS.currentImports
      .path(queryData)
      .filter(({ status }) => status)
      .map(({ id, status, name }) => [
        id,
        {
          documentId: id,
          documentName: name,
          eventType: status,
        },
      ]);
    if (currentImports.length)
      setActiveImports({
        ...Object.fromEntries(currentImports),
        ...activeImports,
      });
  }, [queryData]);

  const { data: subscriptionData } = useSubscription(
    SUBSCRIPTION_DOCUMENT.query,
    {
      variables: { userId: session.user.id },
    },
  );
  useEffect(() => {
    const document = SUBSCRIPTION_DOCUMENT.path(subscriptionData);
    if (document)
      setActiveImports({
        ...activeImports,
        [document.documentId]: document,
      });
  }, [subscriptionData]);
};

export { useData };
