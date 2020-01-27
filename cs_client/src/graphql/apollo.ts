import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:1230/graphql',
});

export { client }