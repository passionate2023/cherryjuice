import { useContext, useEffect } from 'react';
import { RootContext } from '::root/root-context';
import { useSubscription } from '@apollo/react-hooks';
import { SUBSCRIPTION_DOCUMENT } from '::graphql/subscriptions';
import { DocumentSubscription } from '::types/graphql/generated';
import { ac } from '::root/store/store';

const getOperationCategory = (
  document: DocumentSubscription,
): 'exports' | 'imports' =>
  document.status.startsWith('EXPORT') ? 'exports' : 'imports';

const useGetActiveOperations = () => {
  const { session } = useContext(RootContext);
  const { data } = useSubscription(SUBSCRIPTION_DOCUMENT.query, {
    variables: { userId: session.user.id },
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
