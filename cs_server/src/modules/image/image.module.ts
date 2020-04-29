import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { DocumentModule } from '../document/document.module';
import { ImageSqliteRepository } from './repositories/image.sqlite.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './repositories/image.repository';

@Module({
  providers: [ImageSqliteRepository, ImageService],
  imports: [
    forwardRef(() => DocumentModule),
    TypeOrmModule.forFeature([ImageRepository]),
  ],
  exports: [ImageService, ImageSqliteRepository],
})
export class ImageModule {}
