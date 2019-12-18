import { ApolloServer, gql } from 'apollo-server-express';
import {  loadNodes, loadPNG, loadRichText } from './data';
import { app } from './server';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Ct_nodeImage {
    png: String
    offset: Int
    node_id: Int
  }


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
    rich_txt: String
    png: [Ct_nodeImage]
  }

  type Query {
    ct_nodes(node_id: Int): [Ct_node]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    ct_nodes: loadNodes
  },
  Ct_node: {
    rich_txt: loadRichText,
    png: loadPNG,
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

export { app as apolloApp };
