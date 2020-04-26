import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
const authState = {
  token: '',
};
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: authState.token ? `Bearer ${authState.token}` : '',
    },
  };
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(
    createUploadLink({
      uri: process.env.graphqlAPI || '/graphql',
    }),
  ),
});

export { client, authState };
