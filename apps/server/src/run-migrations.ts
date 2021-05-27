import { createConnection } from 'typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import config from './config/typeorm.config';

export const runMigrations = async () => {
  const connection = await createConnection({
    ...config,
  } as ConnectionOptions);

  await connection.runMigrations({
    transaction: 'all',
  });
  await connection.close();
};
