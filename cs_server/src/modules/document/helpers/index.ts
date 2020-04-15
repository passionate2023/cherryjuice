import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as shortHash from 'shorthash';
import { DocumentMeta } from '../modules/document-meta/document-meta.entity';
import { NodeMeta } from '../modules/node-meta/node-meta.entity';
const createLegacyID = name =>
  crypto
    .createHash('md5')
    .update(name)
    .digest('hex');

const legacyFileIDToNewID = ({
  legacyID,
  files,
}: {
  legacyID: string;
  files: any[];
}) => files.find(file => createLegacyID(file.name) === legacyID)?.id;
const adaptFileID = (file_id, files) =>
  file_id.length === 32
    ? legacyFileIDToNewID({
        legacyID: file_id,
        files: Array.from(files.values()),
      })
    : file_id;

const fileNames = {};
const resolve = ({
  folderPath,
  res,
  userID,
}: {
  folderPath;
  userID;
  res: DocumentMeta[];
}) => {
  const fullFolderPath = path.resolve(__dirname, folderPath);
  const dir = fs.readdirSync(fullFolderPath);
  dir.forEach(file => {
    const lePath = path.resolve(fullFolderPath, file);
    const stats = fs.lstatSync(lePath);
    if (stats.isDirectory()) {
      resolve({ folderPath: lePath, res, userID });
    } else if (file.endsWith('ctb')) {
      const { size, birthtimeMs, mtimeMs } = fs.statSync(lePath);
      if (!fileNames[file]) fileNames[file] = 0;
      else fileNames[file]++;
      res.push({
        name: file,
        size,
        createdAt: birthtimeMs,
        updatedAt: mtimeMs,
        id: shortHash.unique(
          crypto
            .createHash('md5')
            .update(userID + file + fileNames[file])
            .digest('hex'),
        ),
        folder: fullFolderPath,
      });
    }
  });
};
const scanFolder: ({
  folders,
  userID,
}: {
  folders: string[];
  userID: string;
}) => Map<string, DocumentMeta> = ({ folders, userID }) => {
  const res = [];

  folders.forEach(folderPath => resolve({ folderPath, userID, res }));
  return new Map(res.sort().map(node => [node.id, node]));
};

const nodeTitleHelpers = {
  hasForground: is_richtxt => (is_richtxt >> 2) & 0x01,

  isBold: is_richtxt => (is_richtxt >> 1) & 0x01,
  customIconId: is_ro => is_ro >> 1,
  rgb_str_from_int24bit: int24bit => {
    const r = (int24bit >> 16) & 0xff;
    const g = (int24bit >> 8) & 0xff;
    const b = int24bit & 0xff;
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

const nodeTitleStyle = ({ is_richtxt }) => {
  return JSON.stringify({
    color: nodeTitleHelpers.hasForground(is_richtxt)
      ? nodeTitleHelpers.rgb_str_from_int24bit((is_richtxt >> 3) & 0xffffff)
      : '#ffffff',
    fontWeight: nodeTitleHelpers.isBold(is_richtxt) ? 'bold' : 'normal',
  });
};

const organizeData = async data => {
  const nodes: Map<number, NodeMeta> = new Map(
    data.map(node => [node.node_id, node]),
  );

  data.forEach(node => {
    let parentNode = nodes.get(node.father_id);
    if (parentNode) {
      parentNode.child_nodes.push(node.node_id);
    }

    node.node_title_styles = nodeTitleStyle({ is_richtxt: node.is_richtxt });
    node.icon_id = nodeTitleHelpers.customIconId(node.is_ro);
  });

  data.forEach(node => {
    node.child_nodes.sort(
      // @ts-ignore
      (a, b) => nodes.get(a).sequence - nodes.get(b).sequence,
    );
  });
  return { nodes };
};

export { scanFolder, adaptFileID, organizeData };
