import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { getMetadataArgsStorage } from 'typeorm/index';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
  migrations: [path.resolve(__dirname, '../../migrations/**/*.ts')],
  cli: {
    migrationsDir: 'migrations',
  },
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV === 'development' && false,
};

module.exports = config;
