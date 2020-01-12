import * as sqlite from 'sqlite';
import imageThumbnail from 'image-thumbnail';
import { parseRichText } from '../helpers/ctb-interpreter/pipe';
import {
  bufferToPng,
  ctbQuery,
  getPNGSize,
  organizeData,
} from '../helpers/ctb-content';
import { Ct_Node_Meta, Ct_File } from '../types/generated';
import { getNodes } from '../helpers/files';
import { parseXml } from '../helpers/helpers';

type TState = {
  pngThumbnailOptions: { percentage: number; responseType: string };
  files: Map<number, Ct_File>;
};
const createResolvers = ({ state }: { state: TState }) => {
  const getFiles = (_, { file_id }) => {
    return file_id ? [state.files.get(file_id)] : state.files.values();
  };
  const getNodeMeta = async (
    rootValue,
    { file_id, node_id },
  ): Promise<Ct_Node_Meta[]> => {
    let nodes = await getNodes({
      filePath: state.files.get(file_id).filePath,
      node_id,
    });
    const { nodes: organizedNodes } = await organizeData(nodes);
    return Array.from(organizedNodes.values());
  };

  const getNodeContent = async (_, { file_id, node_id }) => {
    const db = await sqlite.open(state.files.get(file_id).filePath);
    console.log({ file_id, node_id });
    const res = await db.all(ctbQuery.node_text({ node_id })).then(nodes => {
      console.log({ nodes });
      return nodes.map(({ txt, name }) => ({
        name,
        txt,
        file_id,
        node_id,
      }));
    });
    return res;
  };

  const getRichText = async ({ file_id, node_id, name, txt }, ...params) => {
    const db = await sqlite.open(state.files.get(file_id).filePath);
    const otherTables = {
      image: await db
        .all(ctbQuery.images({ node_id, offset: undefined }))
        .then(nodes =>
          nodes.map(({ node_id, offset, justification, anchor, png }) => ({
            node_id,
            offset,
            justification,
            anchor,
            ...getPNGSize(png),
          })),
        ),
      codebox: await db.all(ctbQuery.codebox({ node_id })),
      table: await db.all(ctbQuery.table({ node_id })).then(
        async tables =>
          await Promise.all(
            tables.map(async table => ({
              ...table,
              txt: await parseXml({ xml: table.txt }),
            })),
          ),
      ),
    };

    return parseRichText({
      nodeTableXml: txt,
      otherTables,
    });
  };
  const getPNGThumbnailBase64 = async ({ file_id, node_id }, { offset }) => {
    const db = await sqlite.open(state.files.get(file_id).filePath);
    return db
      .all(ctbQuery.images({ node_id: node_id, offset }))
      .then(
        nodes =>
          nodes.map(({ anchor, png }) => {
            return anchor
              ? null
              : imageThumbnail(png, state.pngThumbnailOptions);
          })[0],
      )
      .catch(console.error);
  };

  const getPNGFullBase64 = async ({ file_id, node_id }, { offset }) => {
    const db = await sqlite.open(state.files.get(file_id).filePath);
    return db.all(ctbQuery.images({ node_id: node_id, offset: offset })).then(
      nodes =>
        nodes.map(({ png }) => {
          return bufferToPng(png);
        })[0],
    );
  };
  return {
    getNodeMeta,
    getRichText,
    getPNGFullBase64,
    getPNGThumbnailBase64,
    getFiles,
    getNodeContent,
  };
};

export { createResolvers };
