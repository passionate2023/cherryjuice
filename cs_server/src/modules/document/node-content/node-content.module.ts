import { forwardRef, Module } from '@nestjs/common';
import { NodeContentService } from './node-content.service';
import { NodeContentResolver } from './node-content.resolver';
import { NodeContentRepository } from './node-content.repository';
import { DocumentModule } from '../document.module';

@Module({
  providers: [NodeContentService, NodeContentResolver,NodeContentRepository],
  exports: [NodeContentService],
  imports: [forwardRef(() => DocumentModule)],
})
export class NodeContentModule {}
