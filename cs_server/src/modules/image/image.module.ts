import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { DocumentModule } from '../document/document.module';
import { ImageSqliteRepository } from './repositories/image.sqlite.repository';

@Module({
  providers: [ImageService, ImageSqliteRepository],
  imports: [forwardRef(() => DocumentModule)],
  exports: [ImageService],
})
export class ImageModule {}
