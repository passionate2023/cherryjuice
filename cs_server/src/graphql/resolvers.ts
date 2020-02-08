import imageThumbnail from 'image-thumbnail';
import { ctbToAbstractHtml } from '../rendering/ctb-to-abstract-html';
import { AbstractHtmlToHtml } from '../rendering/abstract-html-to-html';
import {
  bufferToPng,
  getPNGSize,
  organizeData,
} from '../rendering/ctb-to-abstract-html/helpers';
import { Ct_Node_Meta, Ct_File } from '../types/generated';
import { parseXml } from '../rendering/ctb-to-abstract-html/helpers';
import { ctb } from '../data-access/sqlite/db/ctb';

const getFiles = (_, { file_id }, { files }) => {
  return file_id ? [files.get(file_id)] : files.values();
};
const getNodeMeta = async (
  rootValue,
  { file_id, node_id },
  { files },
): Promise<Ct_Node_Meta[]> => {
  if (!files.get(file_id)) throw new Error('no such file');
  let nodes = await ctb
    .getNodesMeta({
      filePath: files.get(file_id)?.filePath,
      node_id,
    })
    .catch(console.error);
  const { nodes: organizedNodes } = await organizeData(nodes);
  return Array.from(organizedNodes.values());
};

const getNodeContent = async (_, { file_id, node_id }, { files }) => {
  return await ctb
    .getNodeText({ filePath: files.get(file_id)?.filePath, node_id })
    .then(nodes => {
      return nodes.map(({ txt, name }) => ({
        name,
        txt,
        file_id,
        node_id,
      }));
    });
};
// const getRichText = async ({ file_id, node_id, name, txt }, _, { files }) => {
//   const { codebox, table, image } = await ctb.getNodeImagesTablesCodeboxes({
//     filePath: files.get(file_id)?.filePath,
//     node_id,
//   });
//
//   return parseRichText({
//     nodeTableXml: txt,
//     otherTables: {
//       codebox,
//       image: image.map(({ node_id, offset, justification, anchor, png }) => ({
//         node_id,
//         offset,
//         justification,
//         anchor,
//         ...getPNGSize(png),
//       })),
//       table: table.map(async table => ({
//         ...table,
//         txt: await parseXml({ xml: table.txt }),
//       })),
//     },
//   });
// };
const getHtml = async ({ file_id, node_id, name, txt }, _, { files }) => {
  const { codebox, table, image } = await ctb.getNodeImagesTablesCodeboxes({
    node_id,
    filePath: files.get(file_id)?.filePath,
  });
  const otherTables = {
    codebox,
    image: image.map(({ node_id, offset, justification, anchor, png }) => ({
      node_id,
      offset,
      justification,
      anchor,
      ...getPNGSize(png),
    })),
    table: table.map(async table => ({
      ...table,
      txt: await parseXml({ xml: table.txt }),
    })),
  };
  return AbstractHtmlToHtml({
    richText: await ctbToAbstractHtml({
      nodeTableXml: txt,
      otherTables,
      stringify: false,
    }),
  });
};
const getPNGThumbnailBase64 = async (
  { file_id, node_id },
  { offset },
  { files, pngThumbnailOptions },
) => {
  return ctb
    .getNodeImages({
      filePath: files.get(file_id)?.filePath,
      node_id,
      offset,
    })
    .then(nodes => {
      let pngs = nodes.map(({ anchor, png }) => {
        return anchor ? null : imageThumbnail(png, pngThumbnailOptions);
      });
      return offset ? pngs[0] : pngs;
    })
    .catch(console.error);
};

const getPNGFullBase64 = async (
  { file_id, node_id },
  { offset },
  { files },
) => {
  return ctb
    .getNodeImages({
      filePath: files.get(file_id)?.filePath,
      node_id,
      offset,
    })
    .then(nodes => {
      let pngs = nodes.map(({ png }) => {
        return bufferToPng(png);
      });
      return offset ? pngs[0] : pngs;
    });
};

export {
  getNodeMeta,
  // getRichText,
  getPNGFullBase64,
  getPNGThumbnailBase64,
  getFiles,
  getNodeContent,
  getHtml,
};
