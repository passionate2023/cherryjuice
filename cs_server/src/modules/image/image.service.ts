import imageThumbnail from 'image-thumbnail';
import { Injectable } from '@nestjs/common';
import { ImageSqliteRepository } from './repositories/image.sqlite.repository';
import { bufferToPng } from '../node/helpers/ctb';
import { Node } from '../node/entities/node.entity';
import { Image } from './entities/image.entity';
import { IImageService } from './interfaces/image.service';

@Injectable()
export class ImageService implements IImageService {
  constructor(private imageSqliteRepository: ImageSqliteRepository) {}

  async getPNGFullBase64({ node_id, offset }): Promise<string[]> {
    return this.imageSqliteRepository
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
    return this.imageSqliteRepository
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

  async saveImages(nodes: Node[]): Promise<void> {
    for (const node of nodes) {
      const images = await this.imageSqliteRepository.getNodeImages({
        node_id: node.node_id,
        offset: undefined,
      });
      for (const { png } of images) {
        if (png) {
          const image = new Image();
          image.image = png;
          image.thumbnail = await imageThumbnail(png, {
            percentage: 5,
          });
          image.nodeId = node.id;
          await image.save();
        }
      }
    }
  }
}
