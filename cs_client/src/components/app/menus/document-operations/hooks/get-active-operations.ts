import { useContext, useEffect } from 'react';
import { RootContext } from '::root/root-context';
import { useSubscription } from '@apollo/react-hooks';
import { SUBSCRIPTION_DOCUMENT } from '::graphql/subscriptions';
import { DS } from '::types/graphql/generated';

const useGetActiveOperations = ({ activeImports, setActiveImports }) => {
  const { session } = useContext(RootContext);
  const { data } = useSubscription(SUBSCRIPTION_DOCUMENT.query, {
    variables: { userId: session.user.id },
  });
  useEffect(() => {
    const document = SUBSCRIPTION_DOCUMENT.path(data);
    if (document) {
      const newState = {
        ...activeImports,
        [document.documentId]: document,
      };
      if (document.eventType === DS.DELETED)
        delete newState[document.documentId];
      setActiveImports(newState);
    }
  }, [data]);
};

export { useGetActiveOperations };
