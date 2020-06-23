import * as sqlite from 'sqlite';
import * as fs from 'fs';
import { Node } from '../../node/entities/node.entity';
import { queries } from './helpers/queries';

const exportsFolder = '/.cs/exports';
class ExportCTB {
  private db: sqlite.Database;
  private readonly documentFolder;
  private readonly documentPath;
  private readonly documentName;

  constructor(documentName: string, private readonly userId: string) {
    this.documentFolder = `${exportsFolder}/user-${userId}`;
    this.documentName = `${documentName}-${new Date().getTime()}.ctb`;
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
    for (const node_id of node.child_nodes) {
      const i = node.child_nodes.indexOf(node_id);
      const childNode = nodesMap.get(+node_id);
      if (!childNode) {
        continue;
      }
      await this.db.exec(
        queries.insertNodeTableAndChildrenTable({
          node: childNode,
          sequence: i + 1,
        }),
      );
      await this.writeNodeMeta(nodesMap)(childNode.node_id);
    }
  };

  writeNodesMeta = async (nodes: Node[]): Promise<void> => {
    const nodesMap = new Map(nodes.map(node => [node.node_id, node]));
    // console.log('nodesMap', nodesMap);
    await this.writeNodeMeta(nodesMap)(0);
  };
}

export { ExportCTB };
