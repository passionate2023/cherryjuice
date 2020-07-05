import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { DocumentModule } from '../document/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './repositories/image.repository';

@Module({
  providers: [ImageService],
  imports: [
    forwardRef(() => DocumentModule),
    TypeOrmModule.forFeature([ImageRepository]),
  ],
  exports: [ImageService],
})
export class ImageModule {}
