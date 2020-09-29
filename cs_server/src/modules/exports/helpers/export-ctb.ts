import * as sqlite from 'sqlite';
import * as fs from 'fs';
import { Node } from '../../node/entities/node.entity';
import { queries } from './helpers/queries/queries';
import sqlite3 from 'sqlite3';
import {
  LoadedImageRow,
  UnloadedImageRow,
} from './helpers/ahtml-to-ctb/helpers/translate-ahtml/helpers/translate-object/objects/image';
import { LoadedImages } from './__tests__/__data__/images/get-loaded-images';
import { deleteFolder } from '../../shared/fs/delete-folder';
import {
  FileLocation,
  resolveFileLocation,
} from '../../shared/fs/resolve-file-location';
import { Notify } from '../exports.service';

type DebugOptions = {
  verbose?: boolean;
};

type GetNodeImages = (
  nodeId: string,
  nodeImages?: UnloadedImageRow[],
) => Promise<LoadedImages>;

type DocumentMeta = { name: string; hash: string; userId: string; id: string };
export const escapeUnsafeCharacters = (text: string): string =>
  text.replace(/([/\\:*?"<>|])/g, '_');
class ExportCTB {
  private db: sqlite.Database;
  private readonly documentFolder;
  private readonly documentName;
  private readonly debugOptions: DebugOptions;
  private readonly fileLocation: FileLocation;
  constructor(
    { hash, name, userId, id }: DocumentMeta,
    debugOptions: DebugOptions = {},
  ) {
    this.debugOptions = debugOptions;
    this.documentName = `${name}.ctb`;
    this.documentFolder = `${userId}/${id}/${hash}`;
    this.fileLocation = resolveFileLocation({
      userId,
      fileName: name,
      extension: 'ctb',
      timeStamp: hash,
      type: 'export',
    });
  }
  get getFileLocation(): FileLocation {
    return this.fileLocation;
  }

  get getDb(): sqlite.Database {
    return this.db;
  }

  createCtb = async (): Promise<sqlite.Database> => {
    await deleteFolder(this.fileLocation.folder, true);
    fs.mkdirSync(this.fileLocation.folder, { recursive: true });
    this.db = await sqlite.open(this.fileLocation.path);
    if (this.debugOptions.verbose) {
      sqlite3.verbose();
      // eslint-disable-next-line no-console
      this.db.on('trace', console.log);
    }
    return this.db;
  };

  createTables = async (): Promise<void> => {
    try {
      await this.db.exec(queries.createTables());
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };
  closeCtb = async (): Promise<void> => {
    await this.db.close();
  };

  private writeAHtml = (
    nodesMap: Map<number, Node>,
    imagesMap: ImagesMap,
    onProgress: OnProgress,
  ) => async (node_id: number): Promise<void> => {
    const node = nodesMap.get(node_id);
    try {
      for await (const node_id of node.child_nodes) {
        const i = node.child_nodes.indexOf(node_id);
        const childNode = nodesMap.get(+node_id);
        if (!childNode) {
          continue;
        }

        try {
          const { queries: qs, images } = queries.insertAHtml({
            node: childNode,
            sequence: i + 1,
          });
          for await (const statement of qs) {
            await this.db.run(statement);
          }
          onProgress();
          imagesMap.set(childNode.id, images);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`node: [${JSON.stringify(node)}]`);
          throw e;
        }
        await this.writeAHtml(
          nodesMap,
          imagesMap,
          onProgress,
        )(childNode.node_id);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`node: [${JSON.stringify(node)}]`);
      throw e;
    }
  };

  writeAHtmls = async (
    nodes: Node[],
    onProgress: Notify,
  ): Promise<ImagesMap> => {
    const imagesMap: ImagesMap = new Map();
    const nodesMap = new Map(nodes.map(node => [node.node_id, node]));
    await this.writeAHtml(nodesMap, imagesMap, onProgress)(0);
    return imagesMap;
  };

  writeNodeImages = async (nodeImages: LoadedImageRow[]): Promise<void> => {
    for (const q of queries.insertImages(nodeImages)) {
      await this.db.run(q);
    }
  };

  writeNodesImages = async ({
    imagesPerNode,
    getNodeImages,
    onProgress,
  }: {
    getNodeImages: GetNodeImages;
    imagesPerNode: ImagesMap;
    onProgress: Notify;
  }) => {
    for (const nodeId of imagesPerNode.keys()) {
      const nodeImages = imagesPerNode.get(nodeId);
      const blobImages = await getNodeImages(nodeId, nodeImages);
      const loadedNodeImages: LoadedImageRow[] = nodeImages.map(image => ({
        ...image,
        png: {
          id: image.png.id,
          buffer: blobImages.get(image.png.id),
        },
      }));

      await this.writeNodeImages(loadedNodeImages);
      onProgress();
    }
  };
}
type ImagesMap = Map<string, UnloadedImageRow[]>;
export { ExportCTB };
export { GetNodeImages, DebugOptions, DocumentMeta };
