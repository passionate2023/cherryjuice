import imageThumbnail from 'image-thumbnail';
import { Injectable } from '@nestjs/common';
import { ImageSqliteRepository } from './repositories/image.sqlite.repository';
import { bufferToPng } from '../node/helpers/ctb';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageSqliteRepository) {}

  async getPNGFullBase64({ node_id, offset }): Promise<string[]> {
    return this.imageRepository
      .getNodeImages({
        node_id,
        offset,
      })
      .then(nodes => {
        return nodes.map(({ png }) => {
          return bufferToPng(png);
        });
      });
  }
  async getPNGThumbnailBase64({ node_id, offset }): Promise<Promise<string>[]> {
    return this.imageRepository
      .getNodeImages({
        node_id,
        offset,
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
  }
}
