import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';

export class DocumentSqliteRepository {
  private sqlite: { db: Database } = {
    db: undefined,
  };

  async openDB(filename: string): Promise<void> {
    this.sqlite.db = await sqlite.open({ filename, driver: sqlite3.Database });
  }

  async closeDB(): Promise<void> {
    await this.sqlite.db.close();
  }

  async sqliteAll(query: string): Promise<any[]> {
    return this.sqlite.db.all(query);
  }
  async sqliteGet(query: string): Promise<any> {
    return this.sqlite.db.get(query);
  }
}
