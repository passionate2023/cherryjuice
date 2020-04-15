import { forwardRef, Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeResolver } from './node.resolver';
import { NodeRepository } from './node.repository';
import { DocumentModule } from '../../document.module';

@Module({
  providers: [NodeService, NodeResolver, NodeRepository],
  exports: [NodeService],
  imports: [forwardRef(() => DocumentModule)],
})
export class NodeModule {}
