import { forwardRef, Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeResolver } from './node.resolver';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { DocumentModule } from '../document/document.module';
import { ImageModule } from '../image/image.module';
import { NodeRepository } from './repositories/node.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeMutationsResolver } from './node.mutations.resolver';
import { ImportsModule } from '../imports/imports.module';

@Module({
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
    ImportsModule,
  ],
})
export class NodeModule {}
