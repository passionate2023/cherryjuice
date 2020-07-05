import { Injectable } from '@nestjs/common';
import { ImageRepository } from './repositories/image.repository';
import { Image } from './entities/image.entity';
import { DeleteResult } from 'typeorm';
import { GetNodeImages } from '../exports/helpers/export-ctb';

const bufferToPng = buffer =>
  buffer ? new Buffer(buffer, 'binary').toString('base64') : undefined;

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  async getPNGFullBase64({ nodeId }: { nodeId: string }): Promise<Image[]> {
    return this.imageRepository
      .getNodeImages({
        nodeId,
        thumbnail: false,
      })
      .then(nodes => {
        return nodes.map(image => {
          image.base64 = bufferToPng(image.image);
          return image;
        });
      });
  }
  getLoadedImages: GetNodeImages = async nodeId => {
    return await this.imageRepository
      .getNodeImages({
        nodeId,
        thumbnail: false,
      })
      .then(nodes => {
        return new Map(nodes.map(image => [image.id, image.image]));
      });
  };
  async getPNGThumbnailBase64({
    nodeId,
  }: {
    nodeId: string;
  }): Promise<Promise<Image>[] | Image[]> {
    return this.imageRepository
      .getNodeImages({
        nodeId,
        thumbnail: true,
      })
      .then(nodes =>
        nodes.map(image => {
          image.base64 = bufferToPng(image.thumbnail);
          return image;
        }),
      );
  }

  async deleteImages(IDs: string[]): Promise<DeleteResult> {
    return await this.imageRepository.deleteImages(IDs);
  }
}
