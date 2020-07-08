import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Document } from '../modules/document/entities/document.entity';
import { Node } from '../modules/node/entities/node.entity';
import { Image } from '../modules/image/entities/image.entity';
import { User } from '../modules/user/entities/user.entity';
import path from 'path';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Document, Node, Image, User],
  migrations: [path.resolve(__dirname, '../../migrations/**/*.ts')],
  cli: {
    migrationsDir: 'migrations',
  },
  keepConnectionAlive: true,
};

module.exports = config;
