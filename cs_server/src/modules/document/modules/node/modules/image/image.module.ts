import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { DocumentModule } from '../../../../document.module';
import { ImageRepository } from './image.repository';

@Module({
  providers: [ImageService, ImageResolver, ImageRepository],
  imports: [forwardRef(() => DocumentModule)],
})
export class ImageModule {}
