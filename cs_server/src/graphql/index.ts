import { ApolloServer } from 'apollo-server-express';
import {
  getNodeMeta,
  getPNGFullBase64,
  getPNGThumbnailBase64,
  getFiles,
  getNodeContent,
  getHtml,
} from './resolvers/queries';
import { setNodeContent } from './resolvers/mutations';
import { typeDefs } from './types';
import { scanFolder } from '../data-access/sqlite/files';

const resolvers = {
  Query: {
    ct_files: getFiles,
    ct_node_meta: getNodeMeta,
    ct_node_content: getNodeContent,
  },
  Mutation: {
    ct_node_content: setNodeContent,
  },
  Ct_node_content: {
    html: getHtml,
    // rich_txt: getRichText,
    png_thumbnail_base64: getPNGThumbnailBase64,
    png_full_base64: getPNGFullBase64,
    all_png_thumbnail_base64: getPNGThumbnailBase64,
    all_png_full_base64: getPNGFullBase64,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    pngThumbnailOptions: { percentage: 5, responseType: 'base64' },
    files: scanFolder({
      folders: ( process.env.ctbFolders|| '' ).split(' '),
    }),
  },
});

const applyApollo = app => server.applyMiddleware({ app });

export { applyApollo };
