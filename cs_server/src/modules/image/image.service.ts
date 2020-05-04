import imageThumbnail from 'image-thumbnail';
import { Injectable } from '@nestjs/common';
import { ImageSqliteRepository } from './repositories/image.sqlite.repository';
import { bufferToPng } from '../node/helpers/ctb';
import { debug } from '../shared';
import { ImageRepository } from './repositories/image.repository';

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
    offset?: number;
    nodeId: string;
  }): Promise<string[]> {
    if (debug.loadSqliteDocuments)
      return this.imageSqliteRepository
        .getNodeImages({
          node_id,
        })
        .then(nodes => {
          return nodes.map(({ png }) => {
            return bufferToPng(png);
          });
        });
    return this.imageRepository
      .getNodeImages({
        nodeId,
        thumbnail: false,
      })
      .then(nodes => {
        return nodes.map(({ image }) => {
          return bufferToPng(image);
        });
      });
  }

  async getPNGThumbnailBase64({
    node_id,
    nodeId,
  }: {
    node_id: number;
    nodeId: string;
  }): Promise<Promise<string>[] | string[]> {
    if (debug.loadSqliteDocuments)
      return this.imageSqliteRepository
        .getNodeImages({
          node_id,
        })
        .then(nodes =>
          nodes.map(async ({ anchor, png }) =>
            anchor
              ? null
              : (
                  await imageThumbnail(png, {
                    percentage: 5,
                    responseType: 'base64',
                  })
                ).toString(),
          ),
        );

    return this.imageRepository
      .getNodeImages({
        nodeId,
        thumbnail: true,
      })
      .then(nodes => {
        return nodes.map(({ thumbnail }) => {
          return bufferToPng(thumbnail);
        });
      });
  }
}
