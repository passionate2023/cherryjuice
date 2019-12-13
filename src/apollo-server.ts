import { ApolloServer, gql } from 'apollo-server-express';
import { loadNodes } from './data';
import { app } from './server';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Ct_node {
    node_id: Int
    father_id: Int
    name: String
    txt: String
    is_richtxt: Int
    has_image: Int
    has_codebox: Int
    has_table: Int
    ts_creation: Float
    ts_lastsave: Float
    child_nodes: [Int]
    txt_parsed: String
  }

  type Query {
    ct_nodes: [Ct_node]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    ct_nodes: loadNodes
  }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

export { app as apolloApp };
