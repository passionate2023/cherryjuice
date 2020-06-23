import { forwardRef, Module } from '@nestjs/common';
import { NodeModule } from '../node/node.module';
import { DocumentModule } from '../document/document.module';
import { ExportsService } from './exports.service';
import { ExportsController } from './exports.controller';

@Module({
  imports: [NodeModule, forwardRef(() => DocumentModule)],
  providers: [ExportsService],
  exports: [ExportsService],
  controllers: [ExportsController],
})
export class ExportsModule {}
