import { forwardRef, Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeResolver } from './node.resolver';
import { DocumentModule } from '../document/document.module';
import { ImageModule } from '../image/image.module';
import { NodeRepository } from './repositories/node.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeMutationsResolver } from './node.mutations.resolver';
import { ImportsModule } from '../imports/imports.module';
import { NodeOwnerRepository } from './repositories/node.owner.repository';

@Module({
  providers: [NodeService, NodeResolver, NodeMutationsResolver],
  exports: [NodeService],
  imports: [
    forwardRef(() => DocumentModule),
    ImageModule,
    TypeOrmModule.forFeature([NodeRepository, NodeOwnerRepository]),
    ImportsModule,
  ],
})
export class NodeModule {}
