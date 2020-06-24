import imageThumbnail from 'image-thumbnail';
import { Injectable } from '@nestjs/common';
import { ImageSqliteRepository } from './repositories/image.sqlite.repository';
import { bufferToPng } from '../node/helpers/ctb';
import { debug } from '../shared';
import { ImageRepository } from './repositories/image.repository';
import { Image } from './entities/image.entity';
import { DeleteResult } from 'typeorm';
import { GetNodeImages } from '../exports/helpers/export-ctb';

@Injectable()
export class ImageService {
  constructor(
    private imageSqliteRepository: ImageSqliteRepository,
    private imageRepository: ImageRepository,
  ) {}

  async getPNGFullBase64({
    node_id,
    nodeId,
  }: {
    node_id: number;
    nodeId: string;
  }): Promise<Image[]> {
    if (debug.loadSqliteDocuments)
      return this.imageSqliteRepository
        .getNodeImages({
          node_id,
        })
        .then(nodes => {
          return nodes.map(({ png }) => {
            const image = new Image();
            image.base64 = bufferToPng(png);
            image.id = new Date().getTime() + '';
            return image;
          });
        });
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
    node_id,
    nodeId,
  }: {
    node_id: number;
    nodeId: string;
  }): Promise<Promise<Image>[] | Image[]> {
    if (debug.loadSqliteDocuments)
      return this.imageSqliteRepository
        .getNodeImages({
          node_id,
        })
        .then(nodes =>
          nodes.map(async ({ anchor, png }) =>
            anchor
              ? null
              : (async () => {
                  const image = new Image();
                  image.base64 = (
                    await imageThumbnail(png, {
                      percentage: 5,
                      responseType: 'base64',
                    })
                  ).toString();
                  image.id = new Date().getTime() + '';
                  return image;
                })(),
          ),
        );

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
