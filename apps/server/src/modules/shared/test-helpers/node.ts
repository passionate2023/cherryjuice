require('dotenv').config();
import { NodeService } from '../../node/node.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NodeResolver } from '../../node/node.resolver';
import { NodeSqliteRepository } from '../../imports/helpers/import-ctb/repositories/node.sqlite.repository';
import { NodeMutationsResolver } from '../../node/node.mutations.resolver';
import { forwardRef } from '@nestjs/common';
import { DocumentModule } from '../../document/document.module';
import { ImageModule } from '../../image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeRepository } from '../../node/repositories/node.repository';
import typeOrmConfig from '../../../config/typeorm.config';
import { ImportsModule } from '../../imports/imports.module';

export type NodeTH = {
  service: NodeService;
  module: TestingModule;
};
const createNodeTestHelpers = async (): Promise<NodeTH> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      NodeService,
      NodeResolver,
      NodeSqliteRepository,
      NodeMutationsResolver,
    ],
    exports: [NodeService, NodeSqliteRepository],
    imports: [
      forwardRef(() => DocumentModule),
      ImageModule,
      TypeOrmModule.forFeature([NodeRepository]),
      TypeOrmModule.forRoot(typeOrmConfig),
      ImportsModule,
    ],
  }).compile();
  const service: NodeService = module.get<NodeService>(NodeService);
  return { service, module };
};

export { createNodeTestHelpers };
