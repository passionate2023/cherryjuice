import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { useEffect, useState } from 'react';
import { apolloClient } from '../apollo-client';

if (process.env.NODE_ENV === 'development')
  localStorage.setItem('graphqlAPIHost', 'localhost:1230');

const host = localStorage.getItem('graphqlAPIHost') || location.host;
const secure = location.protocol === 'https:';

const uri = {
  httpBase: `http${secure ? 's' : ''}://${host}`,
  http: `http${secure ? 's' : ''}://${host}/graphql`,
  ws: `ws${secure ? 's' : ''}://${host}/graphql`,
};
const useApolloClient = (token: string, userId: string) => {
  const [client, setClient] = useState(undefined);
  useEffect(() => {
    const authorization = token ? `Bearer ${token}` : undefined;
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization,
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
          authorization,
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
    apolloClient.setClient(client);
    setClient(client);
    // rootActionCreators.setApolloClient(client);
  }, [userId]);
  return client;
};
export { useApolloClient, uri };
