import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { useEffect } from 'react';
import { rootActionCreators } from '::root/root.reducer';
import { AuthUser } from '::types/graphql/generated';

if (process.env.NODE_ENV === 'development')
  localStorage.setItem('graphqlAPIHost', 'localhost:1230');
const host = localStorage.getItem('graphqlAPIHost') || location.host;
const secure = location.protocol === 'https:';

const uri = {
  http: `http${secure ? 's' : ''}://${host}/graphql`,
  ws: `ws${secure ? 's' : ''}://${host}/graphql`,
};
const useApolloClient = (session: AuthUser) => {
  useEffect(() => {
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${session.token}`,
        },
      };
    });
    const uploadLink = createUploadLink({
      uri: uri.http,
    });
    const httpLink = authLink.concat(uploadLink);
    const wsLink = new WebSocketLink({
      uri: uri.ws,
      options: {
        reconnect: true,
        connectionParams: {
          authorization: `Bearer ${session.token}`,
        },
      },
    });
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink,
      ),
    });
    rootActionCreators.setApolloClient(client);
  }, [session?.user?.id]);
};
export { useApolloClient };
