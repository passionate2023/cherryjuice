import { Injectable, Logger } from '@nestjs/common';
import * as sqlite from 'sqlite';
import { Document } from './document.entity';
import { adaptFileID, scanFolder } from './helpers';
import { Database } from 'sqlite';
import * as path from 'path';

@Injectable()
export class DocumentRepository {
  private logger = new Logger('DocumentRepository');
  private sqlite: { db: Database; file_id: string } = {
    db: undefined,
    file_id: undefined,
  };
  private readonly documents: Map<string, Document>;
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
        this.sqlite.db = await sqlite.open(path.join(file.folder, file.name));
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

  getDocumentsMeta(): Document[] {
    return Array.from(this.documents.values());
  }
  getDocumentMetaById(file_id: string): Document {
    file_id = adaptFileID(file_id, this.documents);
    return this.documents.get(file_id);
  }
}
