import { forwardRef, Module } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { DocumentModule } from '../document/document.module';
import { NodeModule } from '../node/node.module';
import { ImageModule } from '../image/image.module';
import { ImportCTB } from './helpers/import-ctb/import-ctb';

@Module({
  imports: [
    forwardRef(() => DocumentModule),
    forwardRef(() => ImageModule),
    forwardRef(() => NodeModule),
  ],
  providers: [ImportsService, ImportCTB],
  exports: [ImportsService],
})
export class ImportsModule {}
