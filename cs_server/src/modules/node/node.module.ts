import { forwardRef, Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeResolver } from './node.resolver';
import { NodeSqliteRepository } from './repositories/node.sqlite.repository';
import { DocumentModule } from '../document/document.module';
import { ImageModule } from '../image/image.module';

@Module({
  providers: [NodeService, NodeResolver, NodeSqliteRepository],
  exports: [NodeService],
  imports: [forwardRef(() => DocumentModule), ImageModule],
})
export class NodeModule {}
