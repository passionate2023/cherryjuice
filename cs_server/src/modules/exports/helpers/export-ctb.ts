import * as sqlite from 'sqlite';
import * as fs from 'fs';
import { Node } from '../../node/entities/node.entity';
import { queries } from './helpers/queries/queries';
import sqlite3 from 'sqlite3';

const exportsFolder = '/.cs/exports';
type DebugOptions = {
  addSuffixToDocumentName?: boolean;
  verbose?: boolean;
};

class ExportCTB {
  private db: sqlite.Database;
  private readonly documentFolder;
  private readonly documentPath;
  private readonly documentName;
  private readonly debugOptions: DebugOptions;
  constructor(
    documentName: string,
    private readonly userId: string,
    debugOptions: DebugOptions = {},
  ) {
    this.debugOptions = debugOptions;
    this.documentFolder = `${exportsFolder}/user-${userId}`;
    this.documentName = `${documentName}${
      debugOptions.addSuffixToDocumentName ? `-${new Date().getTime()}` : ''
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
    if (this.debugOptions.verbose) {
      sqlite3.verbose();
      // eslint-disable-next-line no-console
      this.db.on('trace', console.log);
    }
    return this.db;
  };

  createTables = async (): Promise<void> => {
    await this.db.exec(queries.createTables());
  };
  closeCtb = async (): Promise<void> => {
    await this.db.close();
  };

  private writeNode = (nodesMap: Map<number, Node>) => async (
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
          for (const statement of queries.insertNode({
            node: childNode,
            sequence: i + 1,
          })) {
            await this.db.run(statement);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`node: [${JSON.stringify(node)}]`);
          throw e;
        }
        await this.writeNode(nodesMap)(childNode.node_id);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`node: [${JSON.stringify(node)}]`);
      throw e;
    }
  };

  writeNodes = async (nodes: Node[]): Promise<void> => {
    const nodesMap = new Map(nodes.map(node => [node.node_id, node]));
    await this.writeNode(nodesMap)(0);
  };
}

export { ExportCTB };
