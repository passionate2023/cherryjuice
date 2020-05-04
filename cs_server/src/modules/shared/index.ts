import { nanoid } from 'nanoid';

const randomUUID10 = () => nanoid(10);

const debug = {
  loadSqliteDocuments: process.env.LOAD_SQLITE_DOCUMENTS || true,
};

export { randomUUID10, debug };
