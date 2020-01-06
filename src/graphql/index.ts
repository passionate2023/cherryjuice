import { ApolloServer, gql } from 'apollo-server-express';
import { createResolvers } from './resolvers';
import { typeDefs } from './types';
import * as path from 'path';
import { scanFolder } from '../helpers/files';

const config = {
  folders: ['C:\\Users\\lpflo\\Desktop\\notes', '../../ctb'],
};
const resolversState = {
  pngThumbnailOptions: { percentage: 20, responseType: 'base64' },
  files: scanFolder({ folders: config.folders }),
};
const {
  getNodeMeta,
  getPNGFullBase64,
  getPNGThumbnailBase64,
  getRichText,
  getFiles,
  getNodeContent,
} = createResolvers({
  state: resolversState,
});

const resolvers = {
  Query: {
    ct_files: getFiles,
    ct_node_meta: getNodeMeta,
    ct_node_content: getNodeContent,
  },
  Ct_node_content: {
    rich_txt: getRichText,
    png_thumbnail_base64: getPNGThumbnailBase64,
    png_full_base64: getPNGFullBase64,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const applyApollo = app => server.applyMiddleware({ app });

export { applyApollo };
