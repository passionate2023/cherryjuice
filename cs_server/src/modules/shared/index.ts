import { nanoid } from 'nanoid'

const randomUUID10 = () => nanoid(10);

const debug = {
  loadSqliteDocuments: false,
};

export { randomUUID10, debug };
