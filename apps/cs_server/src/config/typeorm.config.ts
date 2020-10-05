import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { Document } from '../modules/document/entities/document.entity';
import { Node } from '../modules/node/entities/node.entity';
import { Image } from '../modules/image/entities/image.entity';
import { User } from '../modules/user/entities/user.entity';
import { DocumentGuest } from '../modules/document/entities/document-guest.entity';
import { UserToken } from '../modules/user/entities/user-token.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Document, Node, Image, User, DocumentGuest, UserToken],
  migrations: [path.resolve(__dirname, '../../migrations/**/*.ts')],
  cli: {
    migrationsDir: 'migrations',
  },
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV === 'development' && false,
};

module.exports = config;
