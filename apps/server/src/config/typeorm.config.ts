// eslint-disable-next-line @typescript-eslint/no-var-requires
import './env/load-env-variables';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { Document } from '../modules/document/entities/document.entity';
import { Node } from '../modules/node/entities/node.entity';
import { Image } from '../modules/image/entities/image.entity';
import { User } from '../modules/user/entities/user.entity';
import { DocumentGuest } from '../modules/document/entities/document-guest.entity';
import { UserToken } from '../modules/user/entities/user-token.entity';
import { Folder } from '../modules/user/entities/folder/folder.entity';

const url = process.env.DATABASE_URL;

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url,
  entities: [Document, Node, Image, User, DocumentGuest, UserToken, Folder],
  migrations: [path.join(__dirname, '../migrations/*.js')],
  cli: {
    migrationsDir: 'migrations',
  },
  keepConnectionAlive: true,
  logging: Boolean(process.env.NODE_ENV === 'development' && false),
};

export default config;
