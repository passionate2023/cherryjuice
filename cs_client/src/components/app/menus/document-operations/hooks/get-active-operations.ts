import { useEffect } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { SUBSCRIPTION_DOCUMENT } from '::graphql/subscriptions';
import { DocumentSubscription } from '::types/graphql/generated';
import { ac } from '::root/store/store';

const getOperationCategory = (
  document: DocumentSubscription,
): 'exports' | 'imports' =>
  document.status.startsWith('EXPORT') ? 'exports' : 'imports';

const useGetActiveOperations = (userId: string) => {
  const { data } = useSubscription(SUBSCRIPTION_DOCUMENT.query, {
    variables: { userId },
  });
  useEffect(() => {
    const document = SUBSCRIPTION_DOCUMENT.path(data);
    if (document) {
      const operationCategory = getOperationCategory(document);
      if (operationCategory === 'exports')
        ac.documentOperations.addExports([document]);
      else if (operationCategory === 'imports')
        ac.documentOperations.addImports([document]);
    }
  }, [data]);
};

export { useGetActiveOperations, getOperationCategory };
