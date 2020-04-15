import { Injectable, Logger } from '@nestjs/common';
import * as sqlite from 'sqlite';
import { NodeMeta } from './modules/node-meta/node-meta.entity';
import { adaptFileID, scanFolder } from './helpers';
import { DocumentMeta } from './modules/document-meta/document-meta.entity';
import { Database } from 'sqlite';

const queries = {
  read: {
    node_meta: `
  SELECT 
    n.node_id, n.name, n.is_ro, 
    n.is_richtxt, n.has_image, n.has_codebox,
    n.has_table,n.ts_creation,n.ts_lastsave, c.father_id,c.sequence 
   FROM node as n INNER JOIN children AS c
   on n.node_id = c.node_id`,
  },
};

@Injectable()
export class DocumentRepository {
  private logger = new Logger('DocumentRepository');
  private sqlite: { db: Database; file_id: string } = {
    db: undefined,
    file_id: undefined,
  };
  private readonly documents: Map<string, DocumentMeta>;
  constructor() {
    this.documents = scanFolder({
      folders: (process.env.ctbFolders || '').split(' '),
      userID: 'user0',
    });
  }
  async open(file_id: string): Promise<void> {
    if (file_id !== this.sqlite.file_id) {
      file_id = adaptFileID(file_id, this.documents);
      const file = this.documents.get(file_id);
      if (file) {
        this.sqlite.db = await sqlite.open(file.filePath);
        this.sqlite.file_id = file_id;
      }
    }
  }
  async all(query: string): Promise<any[]> {
    return this.sqlite.db.all(query);
  }
  async get(query: string): Promise<any> {
    return this.sqlite.db.get(query);
  }

  getDocumentsMeta(): DocumentMeta[] {
    return Array.from(this.documents.values());
  }
  getDocumentMetaById(file_id: string): DocumentMeta {
    file_id = adaptFileID(file_id, this.documents);
    return this.documents.get(file_id);
  }

  async getNodesMeta(): Promise<NodeMeta[]> {
    const data: NodeMeta[] = await this.all(queries.read.node_meta).then(data =>
      data.map(node => ({
        ...node,
        child_nodes: [],
        is_empty: false,
      })),
    );

    // @ts-ignore
    data.push({
      node_id: 0,
      father_id: -1,
      name: 'root',
      txt: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
      is_richtxt: 0,
      has_image: 0,
      has_codebox: 0,
      has_table: 0,
      sequence: 0,
      ts_creation: 0,
      ts_lastsave: 0,
      child_nodes: [],
      has_txt: false,
      is_empty: 0,
      node_title_styles: '',
      icon_id: '',
    } as unknown);

    return data;
  }
}
