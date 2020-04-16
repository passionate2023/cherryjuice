import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Document } from '../modules/document/entities/document.entity';
import { Node } from '../modules/node/entities/node.entity';
import { Image } from '../modules/image/entities/image.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'oooo',
  database: 'cs',
  entities: [Document, Node, Image],
  synchronize: true,
};

export { config as typeOrmConfig };
