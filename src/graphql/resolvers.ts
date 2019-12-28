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
import { TCt_node, TFile } from '../types/types';

type TState = {
  pngThumbnailOptions: { percentage: number; responseType: string };
  files: Map<number, TFile>;
};
const createResolvers = ({ state }: { state: TState }) => {
  const getNodes = async ({ file_id, node_id }) => {
    const db = await sqlite.open(state.files.get(file_id).filePath);

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

  const loadPNG = async (_, { file_id, node_id, offset }) => {
    const db = await sqlite.open(state.files.get(file_id).filePath);
    return db.all(ctbQuery.images({ node_id: node_id, offset: offset })).then(
      nodes =>
        nodes.map(({ png }) => {
          return bufferToPng(png);
        })[0]
    );
  };

  const loadPNGMeta = async (rootValue, { file_id }) => {
    console.log({ file_id, node_id: rootValue.node_id });
    const db = await sqlite.open(state.files.get(file_id).filePath);
    return db
      .all(ctbQuery.images({ node_id: rootValue.node_id, offset: undefined }))
      .then(nodes =>
        nodes.map(({ offset, node_id, anchor, png }) => {
          const dimensions = getPNGSize(png);
          return {
            node_id,
            offset,
            anchor,
            thumbnail: anchor
              ? null
              : imageThumbnail(png, state.pngThumbnailOptions),
            ...dimensions
          };
        })
      )
      .catch(console.error);
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
    let rawData = await getNodes({ file_id, node_id });
    const { nodes: organizedNodes } = await organizeData(rawData);
    return Array.from(organizedNodes.values());
  };
  const getFiles = (_, { file_id }) => {
    return file_id ? [state.files.get(file_id)] : state.files.values();
  };
  return { loadNodes, loadRichText, loadPNGMeta, loadPNG, getFiles };
};

export { createResolvers };
