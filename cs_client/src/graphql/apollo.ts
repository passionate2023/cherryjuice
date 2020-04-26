import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: process.env.graphqlAPI || '/graphql',
    headers: {
      authorization: `bearer ${localStorage.getItem('cs.user.token')}`,
    },
  }),
});

export { client };
