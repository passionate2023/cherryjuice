import ApolloClient from 'apollo-boost';

localStorage.setItem(
  'token',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inljbm1oZCIsImlhdCI6MTU4NzI5OTM4NiwiZXhwIjoxNTg5ODkxMzg2fQ.K5hftaLKktZseiRSCYYXG_AnkhwS8oylmCgjvuJrPno',
);

const client = new ApolloClient({
  uri: process.env.graphqlAPI || '/graphql',
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

export { client };
