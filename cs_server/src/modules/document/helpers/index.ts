import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as shortHash from 'shorthash';
import { Document } from '../entities/document.entity';
import { Node } from '../../node/entities/node.entity';

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
const resolve = ({ folderPath, res, userID }: { folderPath; userID; res }) => {
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
        node: [],
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
}) => Map<string, Document> = ({ folders, userID }) => {
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

const nodeTitleStyle = ({
  is_richtxt,
  is_ro,
}: {
  is_richtxt: number;
  is_ro: number;
}) => {
  const style: {
    color?: string;
    fontWeight?: string;
    icon_id?: number;
  } = {};
  const hasCustomColor = nodeTitleHelpers.hasForground(is_richtxt);
  if (hasCustomColor)
    style.color = nodeTitleHelpers.rgb_str_from_int24bit(
      (is_richtxt >> 3) & 0xffffff,
    );
  const isBold = nodeTitleHelpers.isBold(is_richtxt);
  if (isBold) style.fontWeight = 'bold';

  const customIconId = nodeTitleHelpers.customIconId(is_ro);
  if (customIconId) style.icon_id = customIconId;
  return hasCustomColor || customIconId || isBold
    ? JSON.stringify(style)
    : undefined;
};

const organizeData = async (data): Promise<Map<number, Node>> => {
  const nodes: Map<number, Node> = new Map(
    data.map(node => [node.node_id, node]),
  );

  data.forEach(node => {
    const parentNode = nodes.get(node.father_id);
    if (parentNode) {
      parentNode.child_nodes.push(node.node_id);
    }

    node.node_title_styles = nodeTitleStyle({
      is_richtxt: node.is_richtxt,
      is_ro: node.is_ro,
    });
  });

  data.forEach(node => {
    node.child_nodes.sort(
      // @ts-ignore
      (a, b) => nodes.get(a).sequence - nodes.get(b).sequence,
    );
  });
  return nodes;
};

const copyProperties = (FROM, TO, excludedProperties) => {
  Object.entries(FROM).forEach(([key, value]) => {
    if (!excludedProperties[key]) TO[key] = value;
  });
};
export {
  scanFolder,
  adaptFileID,
  organizeData,
  copyProperties,
  nodeTitleStyle,
  nodeTitleHelpers,
};
