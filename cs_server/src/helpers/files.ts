import * as path from 'path';
import * as fs from 'fs';
import slugify from 'slugify';
import * as crypto from 'crypto';
import { TCt_node, TFile } from '../types/types';
import * as sqlite from 'sqlite';
import { ctbQuery, rootNode } from './ctb-content';

const scanFolder: ({
  folders,
}: {
  folders: string[];
}) => Map<number, TFile> = ({ folders }) => {
  const res = [];

  const resolve = folderPath => {
    const fullFolderPath = path.resolve(__dirname, folderPath);
    const dir = fs.readdirSync(fullFolderPath);
    dir.forEach(file => {
      const lePath = path.resolve(fullFolderPath, file);
      const stats = fs.lstatSync(lePath);
      if (stats.isDirectory()) {
        resolve(lePath);
      } else if (file.endsWith('ctb')) {
        const { size, birthtimeMs, mtimeMs, ctimeMs, atimeMs } = fs.statSync(
          lePath,
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
          filePath: lePath,
        });
      }
    });
  };

  folders.forEach(resolve);
  const files: Map<number, TFile> = new Map(
    res.sort().map(node => [node.id, node]),
  );
  return files;
};

const getNodes = async ({ filePath, node_id }: {filePath: string, node_id: number}) => {
  console.log({filePath, node_id});
  const db = await sqlite.open(filePath);

  const data: TCt_node[] = await db
    .all(ctbQuery.node_meta({ node_id }))
    .then(data =>
      data.map(node => ({
        ...node,
        child_nodes: [],
        // has_txt: node.txt.length > rootNode.txt.length,
        // todo: find a way to check wether a node is mpty without quering its text
        is_empty: false,
      })),
    );
  if (!node_id) {
    rootNode.child_nodes = [];
    data.push(rootNode);
  }

  return data;
};

export { scanFolder, getNodes };
