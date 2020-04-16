import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { DocumentModule } from '../../../../document.module';
import { ImageRepository } from './image.repository';

@Module({
  providers: [ImageService, ImageRepository],
  imports: [forwardRef(() => DocumentModule)],
  exports: [ImageService],
})
export class ImageModule {}
