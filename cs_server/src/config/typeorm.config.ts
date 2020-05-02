import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Document } from '../modules/document/entities/document.entity';
import { Node } from '../modules/node/entities/node.entity';
import { Image } from '../modules/image/entities/image.entity';
import { User } from '../modules/user/entities/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  entities: [Document, Node, Image, User],
  keepConnectionAlive: true,
};

export { config as typeOrmConfig };
