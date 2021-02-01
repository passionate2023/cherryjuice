import { useEffect } from 'react';
import { DOCUMENT_OPERATION } from '::graphql/subscriptions';
import { ac } from '::store/store';
import { apolloClient } from '::graphql/client/apollo-client';
import { alerts } from '::helpers/texts/alerts';
import { AlertType } from '::types/react';

const useGetActiveOperations = (userId: string) => {
  useEffect(() => {
    if (!userId) return;
    const gqlQuery = DOCUMENT_OPERATION({ userId });
    const obs = apolloClient.subscribe(gqlQuery);
    const subscription = obs.subscribe({
      next: ({ data }) => {
        const document = gqlQuery.path(data);
        if (document) {
          ac.documentOperations.add(document);
        }
      },
      error: error =>
        ac.dialogs.setAlert({
          error,
          title: alerts.somethingWentWrong,
          description: alerts.tryRefreshingThePage,
          type: AlertType.Error,
        }),
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
};

export { useGetActiveOperations };
