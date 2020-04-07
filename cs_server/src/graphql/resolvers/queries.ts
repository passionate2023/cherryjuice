import imageThumbnail from 'image-thumbnail';
import { ctbToAHtml } from '../../rendering/query/ctb-to-ahtml';
import { aHtmlToHtml } from '../../rendering/query/ahtml-to-html';
import { bufferToPng, getPNGSize, organizeData } from '../../helpers/ctb';
import { Ct_Node_Meta } from '../../types/generated';
import { parseXml } from '../../helpers/xml';
import { ctb } from '../../data-access/sqlite/db/ctb';
import { adaptFileID } from '../../data-access/sqlite/files';
const getFiles = (_, { file_id }, { files }) => {
  return file_id ? [files.get(adaptFileID(file_id, files))] : files.values();
};
const getNodeMeta = async (
  rootValue,
  { file_id, node_id },
  { files },
): Promise<Ct_Node_Meta[]> => {
  file_id = adaptFileID(file_id, files);
  if (!files.get(file_id)) throw new Error('no such file');
  let nodes = await ctb.getNodesMeta({
    filePath: files.get(file_id)?.filePath,
    node_id,
  });
  // .catch(console.error);

  const { nodes: organizedNodes } = await organizeData(nodes);
  return Array.from(organizedNodes.values());
};

const getNodeContent = async (_, { file_id, node_id }, { files }) => {
  file_id = adaptFileID(file_id, files);
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
const getHtml = async ({ file_id, node_id, txt }, _, { files }) => {
  file_id = adaptFileID(file_id, files);
  const { codebox, table, image } = await ctb.getNodeImagesTablesCodeboxes({
    node_id,
    filePath: files.get(file_id)?.filePath,
  });
  const otherTables = {
    codebox,
    image: image.map(
      ({ node_id, offset, justification, anchor, png, link }) => ({
        node_id,
        offset,
        justification,
        anchor,
        link,
        ...getPNGSize(png),
      }),
    ),
    table: await Promise.all(
      table.map(async table => ({
        ...table,
        txt: await parseXml({ xml: table.txt }),
      })),
    ),
  };
  return aHtmlToHtml({
    richText: await ctbToAHtml({
      nodeTableXml: txt,
      otherTables,
      // stringify: false,
    }),
  });
};
const getPNGThumbnailBase64 = async (
  { file_id, node_id },
  { offset },
  { files, pngThumbnailOptions },
) => {
  file_id = adaptFileID(file_id, files);
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
    });
  // .catch(console.error);
};

const getPNGFullBase64 = async (
  { file_id, node_id },
  { offset },
  { files },
) => {
  file_id = adaptFileID(file_id, files);
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
  getPNGFullBase64,
  getPNGThumbnailBase64,
  getFiles,
  getNodeContent,
  getHtml,
};
