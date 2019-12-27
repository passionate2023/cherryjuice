import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import slugify from 'slugify';
import * as sqlite from 'sqlite';
import imageThumbnail from 'image-thumbnail';
import { parseRichText } from '../helpers/ctb-interpreter';
import {
  bufferToPng,
  getPNGSize,
  organizeData,
  rootNode,
  ctbQuery
} from '../helpers/ctb-content';
import { TCt_node } from '../types/types';

type TState = {
  folderPath: string;
  pngThumbnailOptions: { percentage: number; responseType: string };
  filePath: string;
};
const createResolvers = ({ state }: { state: TState }) => {
  const getNodes = async ({ file_id, node_id }) => {
    const db = await sqlite.open(state.filePath);

    const data: TCt_node[] = await db.all(ctbQuery.nodes(node_id)).then(data =>
      data.map(node => ({
        ...node,
        child_nodes: [],
        has_txt: node.txt.length > rootNode.txt.length
      }))
    );
    if (!node_id) {
      rootNode.child_nodes = [];
      data.push(rootNode);
    }

    return data;
  };

  const loadPNG = async (_, { node_id, offset }) => {
    const db = await sqlite.open(state.filePath);
    return db.all(ctbQuery.images({ node_id: node_id, offset: offset })).then(
      nodes =>
        nodes.map(({ png }) => {
          return bufferToPng(png);
        })[0]
    );
  };

  const loadPNGMeta = async (rootValue, { node_id }) => {
    const db = await sqlite.open(state.filePath);
    return db
      .all(ctbQuery.images({ node_id: rootValue.node_id, offset: undefined }))
      .then(nodes =>
        nodes.map(({ offset, node_id, anchor, png }) => {
          const dimensions = getPNGSize(png);
          return {
            node_id,
            offset,
            anchor,
            thumbnail: imageThumbnail(png, state.pngThumbnailOptions),
            ...dimensions
          };
        })
      );
  };
  const loadRichText = async rootValue => {
    return parseRichText({
      xml: rootValue.txt,
      stringify: true,
      node_name: `id:${rootValue.node_id} name:${rootValue.name}`
    });
  };
  const loadNodes = async (
    rootValue,
    { file_id, node_id }
  ): Promise<TCt_node[]> => {
    let rawData = await getNodes(node_id);
    const { nodes: organizedNodes } = await organizeData(rawData);
    return Array.from(organizedNodes.values());
  };
  const scanFolder = () => {
    const fullFolderPath = path.resolve(__dirname, state.folderPath);
    const dir = fs.readdirSync(fullFolderPath);
    const res = [];
    dir.forEach(file => {
      if (file.endsWith('ctb')) {
        const filePath = path.resolve(fullFolderPath, file);
        const { size, birthtimeMs, mtimeMs, ctimeMs, atimeMs } = fs.statSync(
          filePath
        );
        res.push({
          name: file,
          size,
          fileCreation: birthtimeMs,
          fileContentModification: mtimeMs,
          fileAttributesModification: ctimeMs,
          fileAccess: atimeMs,
          slug: slugify(file.replace('.ctb', '')).substr(0, 30),
          id: crypto
            .createHash('md5')
            .update(file)
            .digest('hex'),
          filePath
        });
      }
    });
    return res;
  };
  return { loadNodes, loadRichText, loadPNGMeta, loadPNG, scanFolder };
};

export { createResolvers };
