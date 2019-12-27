import { ApolloServer, gql } from 'apollo-server-express';
import { createResolvers } from './resolvers';
import { typeDefs } from './types';
import * as path from 'path';

const resolversState = {
  folderPath: '../../ctb',
  filePath: path.resolve(__dirname, '../../ctb/languages.ctb'),
  pngThumbnailOptions: { percentage: 20, responseType: 'base64' }
};
const {
  loadNodes,
  loadPNG,
  scanFolder,
  loadPNGMeta,
  loadRichText
} = createResolvers({ state: resolversState });
const resolvers = {
  Query: {
    ct_nodes: loadNodes,
    base64: loadPNG,
    ct_files: scanFolder
  },
  Ct_node: {
    rich_txt: loadRichText,
    png: loadPNGMeta
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const applyApollo = app => server.applyMiddleware({ app });

export { applyApollo };
