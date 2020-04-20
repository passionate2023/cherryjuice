import { Injectable } from '@nestjs/common';
import * as sqlite from 'sqlite';
import * as path from 'path';
import { Database } from 'sqlite';
import { Document } from '../entities/document.entity';
import { adaptFileID, scanFolder } from '../helpers';
import { IDocumentRepository } from '../interfaces/document.repository';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class DocumentSqliteRepository implements IDocumentRepository {
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
  async openLocalSqliteFile(file_id: string): Promise<void> {
    if (file_id !== this.sqlite.file_id) {
      file_id = adaptFileID(file_id, this.documents);
      const file = this.documents.get(file_id);
      if (file) {
        this.sqlite.db = await sqlite.open(path.join(file.folder, file.name));
        this.sqlite.file_id = file_id;
      }
    }
  }
  async sqliteAll(query: string): Promise<any[]> {
    return this.sqlite.db.all(query);
  }
  async sqliteGet(query: string): Promise<any> {
    return this.sqlite.db.get(query);
  }

  async openUploadedFile(filePath: string): Promise<void> {
    this.sqlite.db = await sqlite.open(filePath);
    this.sqlite.file_id = undefined;
  }

  async getDocumentsMeta(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentMetaById(user: User, file_id: string): Promise<Document> {
    file_id = adaptFileID(file_id, this.documents);
    return this.documents.get(file_id);
  }
}
