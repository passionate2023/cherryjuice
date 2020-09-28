import { useEffect } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { DOCUMENT_OPERATION } from '::graphql/subscriptions';
import { ac } from '::store/store';

const useGetActiveOperations = (userId: string) => {
  const { data } = useSubscription(DOCUMENT_OPERATION.query, {
    variables: { userId },
  });
  useEffect(() => {
    const document = DOCUMENT_OPERATION.path(data);
    if (document) {
      ac.documentOperations.add(document);
    }
  }, [data]);
};

export { useGetActiveOperations };
