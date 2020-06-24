import * as sqlite from 'sqlite';
import * as fs from 'fs';
import { Node } from '../../node/entities/node.entity';
import { queries } from './helpers/queries';
import sqlite3 from 'sqlite3';

const exportsFolder = '/.cs/exports';
type Options = {
  addSuffixToDocumentName?: boolean;
  verbose?: boolean;
  updateNodeIfExists?: boolean;
};

class ExportCTB {
  private db: sqlite.Database;
  private readonly documentFolder;
  private readonly documentPath;
  private readonly documentName;
  private readonly options: Options;
  constructor(
    documentName: string,
    private readonly userId: string,
    options: Options = {},
  ) {
    this.options = options;
    this.documentFolder = `${exportsFolder}/user-${userId}`;
    this.documentName = `${documentName}${
      options.addSuffixToDocumentName ? `-${new Date().getTime()}` : ''
    }.ctb`;
    this.documentPath = `${this.documentFolder}/${this.documentName}`;
  }
  get getDocumentPath(): string {
    return this.documentPath;
  }

  get getDocumentName(): string {
    return this.documentName;
  }

  get getDb(): sqlite.Database {
    return this.db;
  }

  createCtb = async (): Promise<sqlite.Database> => {
    if (!fs.existsSync(this.documentFolder)) {
      fs.mkdirSync(this.documentFolder);
    }
    this.db = await sqlite.open(this.getDocumentPath);
    if (this.options.verbose) {
      sqlite3.verbose();
      // eslint-disable-next-line no-console
      this.db.on('trace', console.log);
    }
    return this.db;
  };

  createTables = async (): Promise<void> => {
    await this.db.exec(queries.createTables);
  };
  closeCtb = async (): Promise<void> => {
    await this.db.close();
  };

  private writeNodeMeta = (nodesMap: Map<number, Node>) => async (
    node_id: number,
  ): Promise<void> => {
    const node = nodesMap.get(node_id);
    try {
      for (const node_id of node.child_nodes) {
        const i = node.child_nodes.indexOf(node_id);
        const childNode = nodesMap.get(+node_id);
        if (!childNode) {
          continue;
        }

        try {
          for (const statement of queries.insertNodeTableAndChildrenTable({
            node: childNode,
            sequence: i + 1,
          })) {
            await this.db.run(statement);
          }
        } catch (e) {
          if (this.options.updateNodeIfExists) {
            for (const statement of queries.updateText(childNode)) {
              await this.db.run(statement);
            }
          } else {
            // eslint-disable-next-line no-console
            console.log(`node: [${JSON.stringify(node)}]`);
            throw e;
          }
        }
        await this.writeNodeMeta(nodesMap)(childNode.node_id);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`node: [${JSON.stringify(node)}]`);
      throw e;
    }
  };

  writeNodesMeta = async (nodes: Node[]): Promise<void> => {
    const nodesMap = new Map(nodes.map(node => [node.node_id, node]));
    await this.writeNodeMeta(nodesMap)(0);
  };
}

export { ExportCTB };
