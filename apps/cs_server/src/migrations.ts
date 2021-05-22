import { createConnection } from 'typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import config from './config/typeorm.config';

export const migrations = async () => {
  const connection = await createConnection({
    ...config,
    logging: 'all',
  } as ConnectionOptions);

  await connection.runMigrations({
    transaction: 'all',
  });
  await connection.close();
};
