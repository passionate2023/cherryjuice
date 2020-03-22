import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: process.env.graphqlAPI || '/graphql',
});

export { client };
