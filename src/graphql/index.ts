import { ApolloServer, gql } from 'apollo-server-express';
import { createResolvers } from './resolvers';
import { typeDefs } from './types';
import * as path from 'path';
import { scanFolder } from '../helpers/files';

const config = {
  folderPath: '../../ctb'
};
const resolversState = {
  pngThumbnailOptions: { percentage: 20, responseType: 'base64' },
  files: scanFolder({ folderPath: config.folderPath })
};
const { loadNodes, loadPNG, loadPNGMeta, loadRichText, getFiles } = createResolvers({
  state: resolversState
});

const resolvers = {
  Query: {
    ct_files: getFiles,
    ct_nodes: loadNodes,
    png_base64: loadPNG,
  },
  Ct_node: {
    rich_txt: loadRichText,
    png_meta: loadPNGMeta
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const applyApollo = app => server.applyMiddleware({ app });

export { applyApollo };
