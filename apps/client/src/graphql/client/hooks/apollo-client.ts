import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { useEffect, useRef, useState } from 'react';
import { apolloClient } from '../apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const host =
  process.env.NODE_PORT && process.env.NODE_ENV === 'development'
    ? `${location.hostname}:${process.env.NODE_PORT}`
    : location.host;
const secure = location.protocol === 'https:';

const uri = {
  httpBase: `http${secure ? 's' : ''}://${host}`,
  http: `http${secure ? 's' : ''}://${host}/graphql`,
  ws: `ws${secure ? 's' : ''}://${host}/graphql`,
};
const useApolloClient = (
  token: string,
  userId: string,
  onConnectionStatusChange: (connected: boolean) => void,
) => {
  const [client, setClient] = useState(undefined);
  const connected = useRef(false);
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
    const wsClient = new SubscriptionClient(uri.ws, {
      reconnect: true,
      connectionParams: {
        authorization,
      },
      timeout: 10000,
    });
    const onDisconnected = () => {
      if (connected.current) {
        connected.current = false;
        onConnectionStatusChange(false);
      }
    };
    const onConnected = () => {
      if (!connected.current) {
        connected.current = true;
        onConnectionStatusChange(true);
      }
    };
    wsClient.onDisconnected(onDisconnected);
    wsClient.onConnected(onConnected);
    wsClient.onReconnected(onConnected);
    const wsLink = new WebSocketLink(wsClient);
    const client = new ApolloClient({
      queryDeduplication: false,
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
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
