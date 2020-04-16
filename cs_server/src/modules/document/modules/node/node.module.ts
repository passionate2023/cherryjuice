import { forwardRef, Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeResolver } from './node.resolver';
import { NodeRepository } from './node.repository';
import { DocumentModule } from '../../document.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  providers: [NodeService, NodeResolver, NodeRepository],
  exports: [NodeService],
  imports: [forwardRef(() => DocumentModule), ImageModule],
})
export class NodeModule {}
